'use client';

import type useProductList from '@/hooks/admin/products/useProductList';
import ProductRow from '@/components/features/admin/products/ProductRow';
import { Product } from '@/types/api/product';
import { MESSAGES } from '@/constants/messages';

interface ProductsTableProps {
  listHooks: ReturnType<typeof useProductList>;
  onEdit: (product: Product) => void;
}

/** プロダクト一覧テーブル */
function ProductsTable({ listHooks, onEdit }: ProductsTableProps) {
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
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border/60 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <th className="w-8 py-3 pl-4"></th>
            <th className="py-3 pr-4">プロダクト</th>
            <th className="hidden py-3 pr-4 lg:table-cell">タグ</th>
            <th className="py-3 pr-4">リンク</th>
            <th className="py-3 pr-4">公開</th>
            <th className="w-20 py-3 pr-4 text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {products.map((product) => (
            <ProductRow
              key={product.product_id}
              product={product}
              isToggling={togglingId === product.product_id}
              onEdit={onEdit}
              onDelete={openDelete}
              onTogglePublished={togglePublished}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsTable;
