'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePostEditorContext } from '@/hooks/admin/posts/usePostEditorContext';
import { POST_SLUG_MAX_LENGTH } from '@/constants/admin/postSlug';

function PostSlug() {
  const { state, actions } = usePostEditorContext();

  return (
    <div className="w-full flex flex-col gap-1 pb-4">
      <div className="flex items-center gap-2">
        <Label htmlFor="post-slug" className="shrink-0 text-gray-500">
          slug
        </Label>
        <Input
          id="post-slug"
          className="font-mono"
          placeholder={state.isPreview ? '' : '未入力ならタイトルから自動生成'}
          value={state.slug}
          maxLength={POST_SLUG_MAX_LENGTH}
          readOnly={state.isPreview}
          autoComplete="off"
          spellCheck={false}
          aria-describedby={state.isPublished ? 'post-slug-note' : undefined}
          onChange={(e) => actions.setSlug(e.target.value)}
        />
      </div>
      {state.isPublished && (
        <p id="post-slug-note" className="text-xs text-amber-600">
          変更すると公開 URL が変わります
        </p>
      )}
    </div>
  );
}

export default PostSlug;
