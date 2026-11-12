'use client';

import ProductsMain from '@/components/features/admin/products/ProductsMain';
import ProductsMainSkeleton from '@/components/features/admin/products/ProductsMainSkeleton';
import SectionError from '@/components/features/admin/common/SectionError';
import useProductsQuery from '@/hooks/admin/products/useProductsQuery';

function ProductsSection() {
  const { data, isError } = useProductsQuery();

  // 表示できるデータが無いときだけスケルトン / エラーにする（再取得失敗では取得済みデータを表示し続ける）
  if (!data) {
    return isError ? (
      <SectionError className="m-4" />
    ) : (
      <ProductsMainSkeleton />
    );
  }

  return <ProductsMain products={data.products} />;
}

export default ProductsSection;
