'use client';

import { X, Check, Link as LinkIcon, Github } from 'lucide-react';
import type useProductForm from '@/hooks/admin/products/useProductForm';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Toggle from '@/components/features/admin/common/Toggle';
import { cn } from '@/lib/utils';

interface ProductDrawerProps {
  formHooks: ReturnType<typeof useProductForm>;
}

/** プロダクトの作成・編集スライドオーバー */
function ProductDrawer({ formHooks }: ProductDrawerProps) {
  const {
    isOpen,
    mode,
    form,
    tagInput,
    isSubmitting,
    close,
    handleTitleChange,
    handleDescriptionChange,
    handleLinkUrlChange,
    handleGithubUrlChange,
    handleSortOrderChange,
    togglePublished,
    handleTagInputChange,
    handleTagInputKeyDown,
    removeTag,
    submit,
  } = formHooks;

  return (
    <>
      {isOpen && (
        <div
          onClick={close}
          className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col bg-card shadow-2xl transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <h2 className="text-[15px] font-semibold text-foreground">
            {mode === 'new' ? 'プロダクトを追加' : 'プロダクトを編集'}
          </h2>
          <button
            type="button"
            onClick={close}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="閉じる"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          {/* title */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                タイトル<span className="ml-1 text-destructive">*</span>
              </label>
              <span className="text-xs text-muted-foreground">
                {form.title.length} / 255
              </span>
            </div>
            <Input
              type="text"
              maxLength={255}
              value={form.title}
              onChange={handleTitleChange}
              placeholder="プロダクト名"
            />
          </div>

          {/* description */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                説明
              </label>
              <span className="text-xs text-muted-foreground">
                {form.description.length} / 2000
              </span>
            </div>
            <Textarea
              rows={3}
              maxLength={2000}
              value={form.description}
              onChange={handleDescriptionChange}
              placeholder="プロダクトの説明"
            />
          </div>

          {/* link_url */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              リンク URL
            </label>
            <div className="flex items-center rounded-md border border-input bg-transparent shadow-sm focus-within:ring-1 focus-within:ring-ring">
              <span className="pl-3 text-muted-foreground">
                <LinkIcon className="h-4 w-4" />
              </span>
              <input
                type="text"
                maxLength={500}
                value={form.linkUrl}
                onChange={handleLinkUrlChange}
                placeholder="https://example.com"
                className="h-9 w-full bg-transparent px-2.5 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* github_url */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              GitHub URL
            </label>
            <div className="flex items-center rounded-md border border-input bg-transparent shadow-sm focus-within:ring-1 focus-within:ring-ring">
              <span className="pl-3 text-muted-foreground">
                <Github className="h-4 w-4" />
              </span>
              <input
                type="text"
                maxLength={500}
                value={form.githubUrl}
                onChange={handleGithubUrlChange}
                placeholder="https://github.com/owner/repo"
                className="h-9 w-full bg-transparent px-2.5 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* tags */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              タグ
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                最大 20 個 / 各 30 文字
              </span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-md bg-muted py-1 pl-2 pr-1 text-xs font-medium text-foreground"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-muted-foreground hover:text-foreground"
                    title="タグを削除"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                placeholder="タグを入力して Enter"
                className="min-w-[120px] flex-1 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* published */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">公開する</p>
              <p className="text-xs text-muted-foreground">
                オフの場合は公開サイトに表示されません。
              </p>
            </div>
            <Toggle
              checked={form.published}
              onChange={togglePublished}
              label="公開する"
            />
          </div>

          {/* sort_order */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              並び順
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                小さいほど先頭
              </span>
            </label>
            <Input
              type="number"
              min={0}
              value={form.sortOrder}
              onChange={handleSortOrderChange}
              className="w-28"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border/60 px-6 py-4">
          <Button variant="ghost" onClick={close} disabled={isSubmitting}>
            キャンセル
          </Button>
          <Button onClick={submit} disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : <Check />}
            保存
          </Button>
        </div>
      </aside>
    </>
  );
}

export default ProductDrawer;
