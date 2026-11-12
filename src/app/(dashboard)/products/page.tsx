import ProductsSection from '@/components/features/admin/products/ProductsSection';

// 取得はクライアントで行う（TanStack Query）。取得中のスケルトンは ProductsSection が出す
export default function Page() {
  return <ProductsSection />;
}
