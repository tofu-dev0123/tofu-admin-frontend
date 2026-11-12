'use client';

import { useState } from 'react';
import {
  Pencil,
  Eye,
  Heading,
  ChevronDown,
  Link as LinkIcon,
  Image as ImageIcon,
  Save,
  Send,
} from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { usePostEditorContext } from '@/hooks/admin/posts/usePostEditorContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IMAGE_ACCEPT_FORMATS } from '@/constants/admin/fileFormats';
import {
  TOOLBAR_GROUPS,
  HEADING_LEVELS,
} from '@/components/features/admin/posts/Editor/markdownToolbarItems';
import { PostStatus } from '@/types/api/post';
import { cn } from '@/lib/utils';
import { MESSAGES } from '@/constants/messages';

function EditorHeader() {
  const { state, actions, ui } = usePostEditorContext();
  const { applyFormat } = actions;
  // 見出しドロップダウンの開閉（表示専用の状態）
  const [isHeadingOpen, setIsHeadingOpen] = useState(false);

  // プレビュー中はエディタが無く書式適用できないため、送信中は内容を変えさせないため無効化する
  const disabled = state.isPreview || state.isSubmitLoading;

  return (
    <CardContent className="flex w-full flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-2 py-3 lg:px-6">
      {/* 左：Edit/Preview 切替 + 書式ツールバー */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Edit / Preview トグル */}
        <button
          type="button"
          onClick={actions.togglePreview}
          className="relative flex h-9 w-20 items-center rounded-full bg-neutral-200"
          aria-label="編集とプレビューの切り替え"
        >
          {/* つまみ: 各アイコン（幅 1/2 = 40px）の中心に揃う位置へ移動 */}
          <span
            className={cn(
              'absolute top-[2px] left-0 h-8 w-8 rounded-full border border-neutral-300 bg-white shadow-sm transition-transform duration-300 ease-in-out',
              state.isPreview ? 'translate-x-11' : 'translate-x-1'
            )}
          />
          <span className="relative z-10 flex h-9 w-1/2 items-center justify-center">
            <Pencil
              className={cn(
                'h-4 w-4',
                state.isPreview ? 'text-neutral-400' : 'text-neutral-900'
              )}
            />
          </span>
          <span className="relative z-10 flex h-9 w-1/2 items-center justify-center">
            <Eye
              className={cn(
                'h-4 w-4',
                state.isPreview ? 'text-neutral-900' : 'text-neutral-400'
              )}
            />
          </span>
        </button>

        <span className="mx-1 h-6 w-px bg-neutral-200" />

        {/* 見出しドロップダウン */}
        <Popover open={isHeadingOpen} onOpenChange={setIsHeadingOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              className="gap-0.5 px-2"
              title="見出し"
            >
              <Heading className="h-[18px]! w-[18px]!" />
              <ChevronDown className="h-3! w-3! text-neutral-400" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-40 p-1">
            {HEADING_LEVELS.map(({ level, label }) => (
              <Button
                key={level}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  applyFormat({ kind: 'heading', level });
                  setIsHeadingOpen(false);
                }}
                className="w-full justify-start text-sm text-neutral-700"
              >
                {label}
              </Button>
            ))}
          </PopoverContent>
        </Popover>

        {/* 書式ボタン群（グループごとに区切り線） */}
        {TOOLBAR_GROUPS.map((group) => (
          <div key={group[0].id} className="flex items-center gap-0.5">
            <span className="mx-1 h-5 w-px bg-neutral-200" />
            {group.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={disabled}
                  onClick={() => applyFormat(item.format)}
                  title={item.label}
                  aria-label={item.label}
                >
                  <Icon className="h-[18px]! w-[18px]!" />
                </Button>
              );
            })}
          </div>
        ))}

        <span className="mx-1 h-5 w-px bg-neutral-200" />

        {/* リンク挿入（URL 入力ポップオーバー） */}
        <Popover
          open={state.isEmbedLinkOpen}
          onOpenChange={actions.handleEmbedLinkOpenChange}
        >
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={disabled}
              title="リンク挿入"
              aria-label="リンク挿入"
            >
              <LinkIcon className="h-[18px]! w-[18px]!" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80 p-3">
            <div className="flex items-center gap-2">
              <Input
                type="url"
                placeholder="URLを入力してください"
                className="h-9 flex-1"
                value={state.inputUrl}
                onChange={actions.handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    actions.handleInsert();
                  }
                }}
              />
              <Button
                type="button"
                className="h-9"
                onClick={actions.handleInsert}
              >
                挿入
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* 画像挿入（既存機能） */}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          onClick={actions.handleImageIconClick}
          title="画像挿入"
          aria-label="画像挿入"
        >
          <ImageIcon className="h-[18px]! w-[18px]!" />
        </Button>
        <input
          type="file"
          accept={IMAGE_ACCEPT_FORMATS}
          // eslint-disable-next-line react-hooks/refs
          ref={ui.imageInputRef}
          onChange={actions.handleImageFileChange}
          className="hidden"
        />
      </div>

      {/* 右：下書き保存 / 公開 */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="gap-1.5 px-3"
          loading={state.submittingStatus === 'DRAFT'}
          disabled={state.isSubmitLoading}
          onClick={() => actions.handleSubmit(state, 'DRAFT' as PostStatus)}
        >
          <Save />
          {state.submittingStatus === 'DRAFT'
            ? MESSAGES.loading.saving
            : '下書き保存'}
        </Button>
        <Button
          type="button"
          className="gap-1.5 px-3"
          disabled={state.isSubmitLoading}
          onClick={() =>
            actions.handleOpenConfirmModal(
              state.thumbnailUrl ?? '',
              state.title,
              state.tags,
              state.content,
              state.slug
            )
          }
        >
          <Send /> 公開
        </Button>
      </div>
    </CardContent>
  );
}

export default EditorHeader;
