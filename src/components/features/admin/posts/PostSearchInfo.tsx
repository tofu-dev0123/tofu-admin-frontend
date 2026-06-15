import { PostStatus } from '@/types/api/post';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select';
import useStatus from '@/hooks/admin/posts/useStatus';

interface PostSearchInfoProps {
  totalPosts: number;
  keyword?: string;
  status: ReturnType<typeof useStatus>;
}

function PostSearchInfo({ totalPosts, keyword, status }: PostSearchInfoProps) {
  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex items-center gap-2 m-4">
        <span className="text-sm text-gray-500">検索結果: {totalPosts}件</span>
        {keyword && (
          <span className="text-sm text-gray-500">キーワード: {keyword}</span>
        )}
      </div>
      <div className="w-40 flex items-center px-0 bg-white rounded-md">
        <Select
          value={status.status || 'ALL'}
          onValueChange={(value) =>
            status.handleStatusChange(value as PostStatus)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="公開ステータス" />
          </SelectTrigger>
          <SelectContent className="border border-gray-200 rounded-md bg-white">
            <SelectGroup>
              <SelectLabel>公開ステータス</SelectLabel>
              <SelectItem value="ALL">全て</SelectItem>
              <SelectItem value="PUBLISHED">公開</SelectItem>
              <SelectItem value="DRAFT">下書き</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default PostSearchInfo;
