'use client';

import type useProductList from '@/hooks/admin/products/useProductList';
import ProductCard from '@/components/features/admin/products/ProductCard';
import { Product } from '@/types/api/product';
import { MESSAGES } from '@/constants/messages';

interface ProductsListProps {
  listHooks: ReturnType<typeof useProductList>;
  onEdit: (product: Product) => void;
}

/** プロダクト一覧（カード形式・縦積み） */
function ProductsList({ listHooks, onEdit }: ProductsListProps) {
  const { products, togglingId, openDelete, togglePublished } = listHooks;

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card px-6 py-16 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">
          {MESSAGES.products.empty}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.product_id}
          product={product}
          isToggling={togglingId === product.product_id}
          onEdit={onEdit}
          onDelete={openDelete}
          onTogglePublished={togglePublished}
        />
      ))}
    </div>
  );
}

export default ProductsList;
