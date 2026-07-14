import ProductsMain from '@/components/features/admin/products/ProductsMain';
import SectionError from '@/components/features/admin/common/SectionError';
import { serverFetch } from '@/lib/api/server';
import type { ProductListResponse } from '@/types/api/product';

async function ProductsSection() {
  let products: ProductListResponse;
  try {
    products = await serverFetch<ProductListResponse>('/admin/products', {
      label: 'プロダクト一覧取得',
    });
  } catch {
    return <SectionError className="m-4" />;
  }

  return <ProductsMain initialProducts={products.products} />;
}

export default ProductsSection;
