'use client';

import { GripVertical, Pencil, Trash2, Link as LinkIcon } from 'lucide-react';
import Toggle from '@/components/features/admin/common/Toggle';
import { Product } from '@/types/api/product';

interface ProductRowProps {
  product: Product;
  isToggling: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onTogglePublished: (product: Product) => void;
}

/** プロダクト一覧の1行 */
function ProductRow({
  product,
  isToggling,
  onEdit,
  onDelete,
  onTogglePublished,
}: ProductRowProps) {
  return (
    <tr className="group transition-colors hover:bg-accent/40">
      <td className="py-3 pl-4 align-middle">
        <span className="text-border">
          <GripVertical className="h-5 w-5" />
        </span>
      </td>
      <td className="py-3 pr-4">
        <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          {product.title}
          {!product.published && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
              下書き
            </span>
          )}
        </p>
        {product.description && (
          <p className="mt-0.5 max-w-md truncate text-xs text-muted-foreground">
            {product.description}
          </p>
        )}
      </td>
      <td className="hidden py-3 pr-4 align-middle lg:table-cell">
        <div className="flex flex-wrap gap-1">
          {product.tags.map((tag) => (
            <span
              key={tag.tag_id}
              className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </td>
      <td className="py-3 pr-4 align-middle">
        {product.link_url ? (
          <a
            href={product.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <LinkIcon className="h-3.5 w-3.5" /> 開く
          </a>
        ) : (
          <span className="text-xs text-border">—</span>
        )}
      </td>
      <td className="py-3 pr-4 align-middle">
        <Toggle
          checked={product.published}
          disabled={isToggling}
          onChange={() => onTogglePublished(product)}
          label="公開状態"
        />
      </td>
      <td className="py-3 pr-4 align-middle">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="編集"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(product.product_id)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            title="削除"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default ProductRow;
