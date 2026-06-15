'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from '@/components/ui/input-group';
import { SearchIcon } from 'lucide-react';
import PostInfo from '@/components/features/admin/posts/PostInfo';
import Alert from '@/components/features/admin/common/Alert';
import useSearchPost from '@/hooks/admin/posts/useSearchPost';
import usePostDeleteAlert from '@/hooks/admin/posts/usePostDeleteAlert';
import usePatchStatusAlert from '@/hooks/admin/posts/usePatchStatusAlert';
import reloadIcon from '@/assets/images/reload-icon.png';
import Image from 'next/image';

interface PostListProps {
  searchPost: ReturnType<typeof useSearchPost>;
  deleteAlert: ReturnType<typeof usePostDeleteAlert>;
  patchStatusAlert: ReturnType<typeof usePatchStatusAlert>;
  handleClickEdit: (postId: number) => void;
}

function PostList({
  searchPost,
  deleteAlert,
  patchStatusAlert,
  handleClickEdit,
}: PostListProps) {
  return (
    <Card className="min-h-screen w-full flex flex-col gap-4 justify-start border-none shadow-none">
      <CardContent className="flex flex-col lg:flex-row items-end lg:items-center justify-between lg:p-4 p-2 lg:gap-4 gap-2">
        <div className="lg:w-100 w-full flex items-center justify-between lg:justify-start gap-4 px-2 lg:px-0">
          <InputGroup className="rounded-full">
            <InputGroupInput
              placeholder="Search..."
              value={searchPost.keyword}
              onChange={searchPost.handleInputChange}
            />
            <InputGroupAddon className="rounded-full">
              <SearchIcon
                className="cursor-pointer hover:opacity-60 duration-200"
                onClick={searchPost.handleSearch}
              />
            </InputGroupAddon>
          </InputGroup>
          <button
            onClick={searchPost.handleReset}
            className="cursor-pointer hover:opacity-60 duration-200 border-none shadow-none"
          >
            <Image
              src={reloadIcon}
              alt="reload"
              width={20}
              height={20}
              className="w-4 h-4"
            />
          </button>
        </div>
      </CardContent>
      <CardContent className="px-4 lg:px-0">
        <hr className="w-full border-gray-200" />
        {searchPost.postList.map((post) => (
          <div
            key={post.post_id}
            className="w-full min-h-25 hover:bg-gray-100/50 duration-200 cursor-pointer"
          >
            <PostInfo
              key={post.post_id}
              post={post}
              handleOpenDeleteAlert={deleteAlert.handleOpen}
              handleOpenPatchStatusAlert={patchStatusAlert.handleOpen}
              handleClickEdit={handleClickEdit}
            />
          </div>
        ))}
      </CardContent>
      <Alert
        open={deleteAlert.open}
        onOpenChange={deleteAlert.handleClose}
        title="記事を削除しますか？"
        cancelText="キャンセル"
        actionText="削除"
        onCancel={deleteAlert.handleClose}
        onAction={deleteAlert.handleDelete}
      />
      <Alert
        open={patchStatusAlert.open}
        onOpenChange={patchStatusAlert.handleClose}
        title="公開を解除しますか？"
        cancelText="キャンセル"
        actionText="公開を解除"
        onCancel={patchStatusAlert.handleClose}
        onAction={patchStatusAlert.handlePatchStatus}
      />
    </Card>
  );
}

export default PostList;
