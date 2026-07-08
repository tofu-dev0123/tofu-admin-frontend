'use client';

import { SearchIcon, X, Loader2 } from 'lucide-react';
import { PostStatus } from '@/types/api/post';
import { cn } from '@/lib/utils';
import useSearchPost from '@/hooks/admin/posts/useSearchPost';
import useStatus from '@/hooks/admin/posts/useStatus';

interface PostSearchBarProps {
  searchPost: ReturnType<typeof useSearchPost>;
  status: ReturnType<typeof useStatus>;
  totalCount: number;
  // 前のリストを保持したまま再取得中（pending 表示）
  isRefetching: boolean;
}

// ステータス絞り込みの pill 定義
const STATUS_OPTIONS: { label: string; value: PostStatus | 'ALL' }[] = [
  { label: '全て', value: 'ALL' },
  { label: '公開', value: 'PUBLISHED' },
  { label: '下書き', value: 'DRAFT' },
];

function PostSearchBar({
  searchPost,
  status,
  totalCount,
  isRefetching,
}: PostSearchBarProps) {
  const hasKeyword = searchPost.keyword.length > 0;
  return (
    <div className="w-full flex flex-col gap-3 border-b border-gray-100 bg-white p-4">
      {/* 検索入力（主役・全幅）。Enter で検索、× でクリア */}
      <div className="flex h-11 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-300 transition-shadow">
        <SearchIcon className="h-4 w-4 shrink-0 text-gray-400" />
        <input
          type="text"
          value={searchPost.keyword}
          onChange={searchPost.handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') searchPost.handleSearch();
          }}
          placeholder="記事を検索...（Enter で実行）"
          className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
        />
        {hasKeyword && (
          <button
            type="button"
            aria-label="検索キーワードをクリア"
            onClick={searchPost.handleClear}
            className="grid h-5 w-5 shrink-0 cursor-pointer place-items-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 duration-200"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* ステータス pill トグル（左） + 件数（右） */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1">
          {STATUS_OPTIONS.map((option) => {
            const isActive = status.status === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => status.handleStatusChange(option.value)}
                className={cn(
                  'cursor-pointer rounded-full px-3 py-1 text-xs duration-200',
                  isActive
                    ? 'bg-white font-bold text-gray-800 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {isRefetching && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />
          )}
          <span>
            検索結果: <b className="font-bold text-gray-700">{totalCount}</b> 件
          </span>
        </div>
      </div>
    </div>
  );
}

export default PostSearchBar;
