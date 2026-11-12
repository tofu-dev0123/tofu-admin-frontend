'use client';

import ProductsMain from '@/components/features/admin/products/ProductsMain';
import ProductsMainSkeleton from '@/components/features/admin/products/ProductsMainSkeleton';
import SectionError from '@/components/features/admin/common/SectionError';
import useProductsQuery from '@/hooks/admin/products/useProductsQuery';

function ProductsSection() {
  const { data, isPending, isError } = useProductsQuery();

  if (isPending) return <ProductsMainSkeleton />;
  if (isError) return <SectionError className="m-4" />;

  return <ProductsMain products={data.products} />;
}

export default ProductsSection;
