import { Suspense } from 'react';
import ProductsSection from '@/components/features/admin/products/ProductsSection';
import ProductsMainSkeleton from '@/components/features/admin/products/ProductsMainSkeleton';

export default function Page() {
  return (
    <Suspense fallback={<ProductsMainSkeleton />}>
      <ProductsSection />
    </Suspense>
  );
}
