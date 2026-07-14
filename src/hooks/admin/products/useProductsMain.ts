'use client';

import { useMemo } from 'react';
import useErrorModal from '@/hooks/admin/common/useErrorModal';
import useProductList from '@/hooks/admin/products/useProductList';
import useProductForm from '@/hooks/admin/products/useProductForm';
import { Product } from '@/types/api/product';

interface UseProductsMainProps {
  initialProducts: Product[];
}

function useProductsMain({ initialProducts }: UseProductsMainProps) {
  const errorModalHooks = useErrorModal();
  const listHooks = useProductList({
    initial: initialProducts,
    showError: errorModalHooks.showError,
  });
  const formHooks = useProductForm({
    showError: errorModalHooks.showError,
    onSaved: listHooks.refetch,
  });

  // 公開/非公開の集計（render 中に導出）
  const stats = useMemo(() => {
    const total = listHooks.products.length;
    const published = listHooks.products.filter((p) => p.published).length;
    return { total, published, unpublished: total - published };
  }, [listHooks.products]);

  return {
    listHooks,
    formHooks,
    errorModalHooks,
    stats,
  };
}

export default useProductsMain;
