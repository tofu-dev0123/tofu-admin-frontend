'use client';

import {
  GripVertical,
  Pencil,
  Trash2,
  Link as LinkIcon,
  Github,
} from 'lucide-react';
import Toggle from '@/components/features/admin/common/Toggle';
import { Product } from '@/types/api/product';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  isToggling: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onTogglePublished: (product: Product) => void;
}

/** プロダクト一覧の1カード */
function ProductCard({
  product,
  isToggling,
  onEdit,
  onDelete,
  onTogglePublished,
}: ProductCardProps) {
  const hasLink = Boolean(product.link_url || product.github_url);

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border p-5 shadow-sm transition hover:shadow-md',
        product.published
          ? 'border-border bg-card'
          : 'border-dashed border-border bg-muted/30'
      )}
    >
      {/* ヘッダー: 並び順 + タイトル / 公開トグル */}
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="inline-flex h-6 shrink-0 items-center rounded-md bg-muted px-1.5 text-[11px] font-semibold text-muted-foreground"
            title="並び順"
          >
            #{product.sort_order}
          </span>
          <h3 className="truncate text-[15px] font-semibold text-foreground">
            {product.title}
          </h3>
          {!product.published && (
            <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
              下書き
            </span>
          )}
        </div>
        <Toggle
          checked={product.published}
          disabled={isToggling}
          onChange={() => onTogglePublished(product)}
          label="公開状態"
        />
      </div>

      {/* 説明 */}
      {product.description && (
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      )}

      {/* タグ */}
      {product.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {product.tags.map((tag) => (
            <span
              key={tag.tag_id}
              className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* フッター: リンク / 操作 */}
      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
        <div className="flex items-center gap-3">
          {hasLink ? (
            <>
              {product.link_url && (
                <a
                  href={product.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <LinkIcon className="h-3.5 w-3.5" /> 開く
                </a>
              )}
              {product.github_url && (
                <a
                  href={product.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <Github className="h-3.5 w-3.5" /> GitHub
                </a>
              )}
            </>
          ) : (
            <span className="text-xs text-border">リンクなし</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span
            className="cursor-grab rounded-md p-1.5 text-border"
            title="並び替え"
          >
            <GripVertical className="h-4 w-4" />
          </span>
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
      </div>
    </div>
  );
}

export default ProductCard;
