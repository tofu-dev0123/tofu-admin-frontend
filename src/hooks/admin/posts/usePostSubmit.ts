import { useState, useCallback } from 'react';
import { post, del } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { PostResponse, PostRequest, PostStatus } from '@/types/api/post';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { useRouter } from 'next/navigation';
import { PostEditorState } from '@/types/admin/posts';
import { ImagesDeleteResponse } from '@/types/api/imagesDelete';
import { useToastStore } from '@/stores/toastStore';
import { extractImageUrls } from '@/services/admin/posts/extractImageUrls';

interface UsePostSubmitProps {
  showError: (message: string[]) => void;
}

function usePostSubmit({ showError }: UsePostSubmitProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(
    async (state: PostEditorState, status: PostStatus) => {
      setIsLoading(true);
      // 画像URLを抽出（下書き送信時のみ実行、公開時は確認モーダルで既に設定済み）
      const attachedImages =
        state.attachedImages.length > 0
          ? state.attachedImages
          : extractImageUrls(state.content);

      // 登録する画像ID,削除する画像IDを選別
      // state.images の中から、attachedImages に含まれているもの → 登録する画像（既に登録済みなので、リクエストに含める）
      const registerImages = state.images
        .filter((image) => attachedImages.includes(image.url))
        .map((image) => image.imageId);

      // state.images の中から、attachedImages に含まれていないもの → 削除する画像
      const deleteImages = state.images
        .filter((image) => !attachedImages.includes(image.url))
        .map((image) => image.imageId);

      // 削除する画像IDがある場合、削除する
      if (deleteImages.length > 0) {
        for (const id of deleteImages) {
          await del<ImagesDeleteResponse>(API_ENDPOINTS.images.delete(id));
        }
      }

      // リクエストデータを作成
      const request: PostRequest = {
        title: state.title,
        content_md: state.content,
        thumbnail_url: state.thumbnailUrl,
        status: status,
        images: registerImages,
        tags: state.tags,
      };

      try {
        // 投稿を作成
        await post<PostResponse>(API_ENDPOINTS.posts.post, request);

        // トーストを表示
        const message =
          status === 'PUBLISHED'
            ? '記事を公開しました'
            : '下書きに保存しました';
        useToastStore.getState().show({
          type: 'success',
          message: message,
        });

        // 投稿を作成したら、投稿一覧ページにリダイレクト
        router.push('/admin/home');
      } catch (error) {
        exceptErrorHandling(error, showError);
      } finally {
        setIsLoading(false);
      }
    },
    [router, showError]
  );

  return {
    isLoading,
    onSubmit,
  };
}

export default usePostSubmit;
