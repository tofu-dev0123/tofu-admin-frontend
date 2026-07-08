'use client';

import Alert from '@/components/features/admin/common/Alert';
import { usePostEditorContext } from '@/hooks/admin/posts/usePostEditorContext';
import useDraftAutosave from '@/hooks/admin/posts/useDraftAutosave';
import { MESSAGES } from '@/constants/messages';

/**
 * 新規作成画面でのみ使用。下書きの自動保存と復元確認を担う。
 */
export function DraftAutosave() {
  const { state, actions } = usePostEditorContext();
  const { hasDraft, restore, discard } = useDraftAutosave({
    title: state.title,
    content: state.content,
    tags: state.tags,
    setTitle: actions.setTitle,
    setContent: actions.setContent,
    setTags: actions.setTags,
  });

  return (
    <Alert
      open={hasDraft}
      onOpenChange={(open) => {
        // 閉じる操作は破棄扱い
        if (!open) discard();
      }}
      title={MESSAGES.draft.restore.title}
      description={MESSAGES.draft.restore.description}
      cancelText={MESSAGES.draft.restore.discard}
      actionText={MESSAGES.draft.restore.restore}
      onCancel={discard}
      onAction={restore}
    />
  );
}

export default DraftAutosave;
