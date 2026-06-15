'use client';

import PostEditEditor from '@/components/features/admin/posts/Editor/PostEditEditor';
import { PostEditProvider } from '@/contexts/admin/posts/PostEditContext';
import { useEditMain } from '@/hooks/admin/posts/useEditMain';
import ErrorModal from '@/components/features/admin/common/ErrorModal';
import { Spinner } from '@/components/ui/spinner';

function EditMain() {
  const { postId, postData, isLoading, errorModalHook } = useEditMain();

  if (isLoading) {
    return (
      <div className="h-full w-6xl flex flex-col mx-auto items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="h-full w-6xl flex flex-col mx-auto items-center justify-center">
        <div className="text-red-500">記事が見つかりません</div>
      </div>
    );
  }

  return (
    <>
      <PostEditProvider
        postId={postId}
        initialData={{
          title: postData.title,
          content: postData.content_md,
          thumbnailId: postData.thumbnail_id,
          thumbnailAltText: postData.thumbnail_alt_text,
          thumbnailUrl: postData.thumbnail_url,
          tags: postData.tags.map((tag) => tag.name),
          images: postData.images.map((image) => ({
            imageId: image.image_id,
            url: image.url,
          })),
        }}
      >
        <div className="lg:w-6xl w-full flex flex-col mx-auto mb-20">
          <PostEditEditor />
        </div>
      </PostEditProvider>
      <ErrorModal
        isOpen={errorModalHook.isOpen}
        errorMessage={errorModalHook.errorMessage}
        onClose={errorModalHook.onClose}
      />
    </>
  );
}

export default EditMain;
