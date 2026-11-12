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
import { clearDraft } from '@/lib/utils/postDraft';
import { logger } from '@/lib/logger';
import { POST_SAVE_TIMEOUT_MS } from '@/constants/admin/apiTimeout';

interface UsePostSubmitProps {
  showError: (message: string[]) => void;
}

function usePostSubmit({ showError }: UsePostSubmitProps) {
  const router = useRouter();
  // 送信中のステータス（どのボタンが押されたかを表示側で判別するため保持）
  const [submittingStatus, setSubmittingStatus] = useState<PostStatus | null>(
    null
  );
  const isLoading = submittingStatus !== null;

  const onSubmit = useCallback(
    async (state: PostEditorState, status: PostStatus) => {
      setSubmittingStatus(status);
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

      // 削除する画像IDがある場合、並列で削除する
      if (deleteImages.length > 0) {
        try {
          await Promise.all(
            deleteImages.map((id) =>
              del<ImagesDeleteResponse>(API_ENDPOINTS.images.delete(id))
            )
          );
        } catch (error) {
          // 失敗時も送信中表示を解除し、ボタンが押せないまま固まらないようにする
          exceptErrorHandling(error, showError);
          setSubmittingStatus(null);
          return;
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
        // slug 生成でバックエンドの応答が遅くなるため、タイムアウトを延長する
        await post<PostResponse>(API_ENDPOINTS.posts.post, request, {
          timeout: POST_SAVE_TIMEOUT_MS,
        });
        logger.info('[posts] 投稿を作成しました', { status });

        // 保存済みの下書きをクリア
        clearDraft();

        // トーストを表示
        const message =
          status === 'PUBLISHED'
            ? '記事を公開しました'
            : '下書きに保存しました';
        useToastStore.getState().show({
          type: 'success',
          message: message,
        });

        // 投稿を作成したら、ホームにリダイレクト
        router.push('/');
      } catch (error) {
        exceptErrorHandling(error, showError);
      } finally {
        setSubmittingStatus(null);
      }
    },
    [router, showError]
  );

  return {
    isLoading,
    submittingStatus,
    onSubmit,
  };
}

export default usePostSubmit;
