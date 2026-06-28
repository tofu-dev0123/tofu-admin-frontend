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
import { IMAGE_ACCEPT_FORMATS } from '@/constants/admin/fileFormats';
import EmbedLink from '@/components/features/admin/posts/Editor/EmbedLink';
import {
  TOOLBAR_GROUPS,
  HEADING_LEVELS,
} from '@/components/features/admin/posts/Editor/markdownToolbarItems';
import { PostStatus } from '@/types/api/post';
import { cn } from '@/lib/utils';

// ツールバーの書式ボタン共通スタイル
const TOOL_BUTTON =
  'flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 disabled:pointer-events-none disabled:opacity-40';

function EditorHeader() {
  const { state, actions, ui } = usePostEditorContext();
  const { applyFormat } = actions;
  // 見出しドロップダウンの開閉（表示専用の状態）
  const [isHeadingOpen, setIsHeadingOpen] = useState(false);

  // プレビュー中はエディタが無く書式適用できないため無効化する
  const disabled = state.isPreview;

  return (
    <>
      <CardContent className="flex w-full flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-2 py-3 lg:px-6">
        {/* 左：Edit/Preview 切替 + 書式ツールバー */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Edit / Preview トグル */}
          <button
            type="button"
            onClick={actions.togglePreview}
            className="relative flex h-9 w-20 items-center justify-between rounded-full bg-neutral-200"
            aria-label="編集とプレビューの切り替え"
          >
            <span
              className={cn(
                'absolute h-8 w-8 rounded-full border border-neutral-300 bg-white shadow-sm transition-transform duration-300 ease-in-out',
                state.isPreview
                  ? 'translate-x-[calc(100%+0.25rem)]'
                  : 'translate-x-[0.125rem]'
              )}
            />
            <span className="relative z-10 flex h-9 w-9 items-center justify-center">
              <Pencil
                className={cn(
                  'h-4 w-4',
                  state.isPreview ? 'text-neutral-400' : 'text-neutral-900'
                )}
              />
            </span>
            <span className="relative z-10 flex h-9 w-9 items-center justify-center">
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
              <button
                type="button"
                disabled={disabled}
                className="flex h-8 items-center gap-0.5 rounded-md px-2 text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 disabled:pointer-events-none disabled:opacity-40"
                title="見出し"
              >
                <Heading className="h-[18px] w-[18px]" />
                <ChevronDown className="h-3 w-3 text-neutral-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-40 p-1">
              {HEADING_LEVELS.map(({ level, label }) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => {
                    applyFormat({ kind: 'heading', level });
                    setIsHeadingOpen(false);
                  }}
                  className="flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm text-neutral-700 transition hover:bg-neutral-100"
                >
                  {label}
                </button>
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
                  <button
                    key={item.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => applyFormat(item.format)}
                    className={TOOL_BUTTON}
                    title={item.label}
                    aria-label={item.label}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </button>
                );
              })}
            </div>
          ))}

          <span className="mx-1 h-5 w-px bg-neutral-200" />

          {/* リンク埋め込み（既存機能） */}
          <button
            type="button"
            disabled={disabled}
            onClick={actions.handleOpenEmbedLink}
            className={TOOL_BUTTON}
            title="リンク埋め込み"
            aria-label="リンク埋め込み"
          >
            <LinkIcon className="h-[18px] w-[18px]" />
          </button>

          {/* 画像挿入（既存機能） */}
          <button
            type="button"
            disabled={disabled}
            onClick={actions.handleImageIconClick}
            className={TOOL_BUTTON}
            title="画像挿入"
            aria-label="画像挿入"
          >
            <ImageIcon className="h-[18px] w-[18px]" />
          </button>
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
          <button
            type="button"
            onClick={() => actions.handleSubmit(state, 'DRAFT' as PostStatus)}
            className="flex h-9 items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            <Save className="h-4 w-4" /> 下書き保存
          </button>
          <button
            type="button"
            onClick={() =>
              actions.handleOpenConfirmModal(
                state.thumbnailUrl ?? '',
                state.title,
                state.tags,
                state.content
              )
            }
            className="flex h-9 items-center gap-1.5 rounded-md bg-neutral-900 px-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            <Send className="h-4 w-4" /> 公開
          </button>
        </div>
      </CardContent>
      <EmbedLink
        open={state.isEmbedLinkOpen}
        onClose={actions.handleCloseEmbedLink}
      />
    </>
  );
}

export default EditorHeader;
