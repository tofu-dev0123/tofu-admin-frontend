'use client';

import { useCallback, useState } from 'react';
import { get, put, del } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import {
  Product,
  ProductListResponse,
  ProductRequest,
  ProductResponse,
  ProductDeleteResponse,
} from '@/types/api/product';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { useToastStore } from '@/stores/toastStore';
import { logger } from '@/lib/logger';

interface UseProductListProps {
  initial: Product[];
  showError: (message: string[]) => void;
}

// Product をリクエスト型へ変換（tags は Tag[] → name[]）
const toRequest = (product: Product): ProductRequest => ({
  title: product.title,
  description: product.description,
  link_url: product.link_url,
  github_url: product.github_url,
  published: product.published,
  sort_order: product.sort_order,
  tags: product.tags.map((tag) => tag.name),
});

/**
 * プロダクト一覧の状態管理。
 * 変更後は GET /admin/products で再取得して同期する。
 */
function useProductList({ initial, showError }: UseProductListProps) {
  const [products, setProducts] = useState<Product[]>(initial);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const refetch = useCallback(async () => {
    const response = await get<ProductListResponse>(API_ENDPOINTS.products.get);
    setProducts(response.products);
  }, []);

  const openDelete = (id: number) => setDeleteTarget(id);
  const closeDelete = () => setDeleteTarget(null);

  const confirmDelete = useCallback(async () => {
    if (deleteTarget === null) return;
    try {
      const response = await del<ProductDeleteResponse>(
        API_ENDPOINTS.products.delete(deleteTarget)
      );
      logger.info('[products] プロダクトを削除しました', {
        productId: deleteTarget,
      });
      useToastStore.getState().show({
        type: 'success',
        message: response.message,
      });
      await refetch();
    } catch (error) {
      exceptErrorHandling(error, showError);
    } finally {
      setDeleteTarget(null);
    }
  }, [deleteTarget, refetch, showError]);

  // 一覧の公開トグル（PUT で published のみ反転して送信）
  const togglePublished = useCallback(
    async (product: Product) => {
      setTogglingId(product.product_id);
      try {
        const request: ProductRequest = {
          ...toRequest(product),
          published: !product.published,
        };
        await put<ProductResponse, ProductRequest>(
          API_ENDPOINTS.products.put(product.product_id),
          request
        );
        logger.info('[products] 公開状態を更新しました', {
          productId: product.product_id,
          published: !product.published,
        });
        await refetch();
      } catch (error) {
        exceptErrorHandling(error, showError);
      } finally {
        setTogglingId(null);
      }
    },
    [refetch, showError]
  );

  return {
    products,
    deleteTarget,
    togglingId,
    refetch,
    openDelete,
    closeDelete,
    confirmDelete,
    togglePublished,
  };
}

export default useProductList;
