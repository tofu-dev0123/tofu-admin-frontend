import { useState, useCallback } from 'react';
import { del, put } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { PostPutResponse, PostPutRequest, PostStatus } from '@/types/api/post';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { useRouter } from 'next/navigation';
import { PostEditorState } from '@/types/admin/posts';
import { ImagesDeleteResponse } from '@/types/api/imagesDelete';
import { useToastStore } from '@/stores/toastStore';
import { extractImageUrls } from '@/services/admin/posts/extractImageUrls';
import { logger } from '@/lib/logger';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import { POST_SAVE_TIMEOUT_MS } from '@/constants/admin/apiTimeout';
import { validateSlug } from '@/services/admin/posts/validateSlug';

interface UsePostEditSubmitProps {
  showError: (message: string[]) => void;
  postId: number;
  // 編集開始時の slug（変更有無の判定に使用）
  initialSlug: string;
}

function usePostEditSubmit({
  showError,
  postId,
  initialSlug,
}: UsePostEditSubmitProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  // 送信中のステータス（どのボタンが押されたかを表示側で判別するため保持）
  const [submittingStatus, setSubmittingStatus] = useState<PostStatus | null>(
    null
  );
  const isLoading = submittingStatus !== null;

  const onSubmit = useCallback(
    async (state: PostEditorState, status: PostStatus) => {
      // 下書き保存でも slug の形式はチェックする（公開時は確認モーダルでも検証済み）
      const slugErrors = validateSlug(state.slug);
      if (slugErrors.length > 0) {
        showError(slugErrors);
        return;
      }

      setSubmittingStatus(status);
      // 画像URLを抽出（下書き送信時のみ実行、公開時は確認モーダルで既に設定済み）
      const attachedImages =
        state.attachedImages.length > 0
          ? state.attachedImages
          : extractImageUrls(state.content);

      // 登録する画像ID,削除する画像IDを選別
      // state.newImages の中から、attachedImages に含まれているもの → 登録する画像（既に登録済みなので、リクエストに含める）
      const registerImages = [];
      if (state.newImages) {
        registerImages.push(
          ...state.newImages
            .filter((image) => attachedImages.includes(image.url))
            .map((image) => image.imageId)
        );
      }

      // state.newImages の中から、attachedImages に含まれていないもの → 削除する画像
      const deleteImages = [];
      if (state.newImages) {
        deleteImages.push(
          ...state.newImages
            .filter((image) => !attachedImages.includes(image.url))
            .map((image) => image.imageId)
        );
      }

      // 削除する画像IDがある場合、削除する
      if (deleteImages.length > 0) {
        try {
          for (const id of deleteImages) {
            await del<ImagesDeleteResponse>(API_ENDPOINTS.images.delete(id));
          }
        } catch (error) {
          // 失敗時も送信中表示を解除し、ボタンが押せないまま固まらないようにする
          exceptErrorHandling(error, showError);
          setSubmittingStatus(null);
          return;
        }
      }

      // state.images の中から、attachedImages に含まれていないもの → APIに削除依頼する画像
      const deleteImagesFromRequest = state.images
        .filter((image) => !attachedImages.includes(image.url))
        .map((image) => image.imageId);

      // リクエストデータを作成
      const request: PostPutRequest = {
        title: state.title,
        // 変更時のみ送る。省略すると現状維持（draft slug は公開時に振り直される）、
        // 空文字はタイトルから再生成になる
        ...(state.slug !== initialSlug && { slug: state.slug }),
        content_md: state.content,
        thumbnail_url: state.thumbnailUrl,
        thumbnail_delete_flag: state.thumbnailDeleteFlag,
        status: status,
        delete_images: deleteImagesFromRequest,
        new_images: registerImages,
        tags: state.tags,
      };

      try {
        // 投稿を更新（編集画面用）
        // slug 生成でバックエンドの応答が遅くなるため、タイムアウトを延長する
        await put<PostPutResponse>(API_ENDPOINTS.posts.put(postId), request, {
          timeout: POST_SAVE_TIMEOUT_MS,
        });
        logger.info('[posts] 投稿を更新しました', { postId, status });

        // 一覧・サマリ・詳細のキャッシュを無効化し、遷移先で最新を取得させる
        void queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });

        // トーストを表示
        const message =
          status === 'PUBLISHED'
            ? '記事を更新しました'
            : '下書きを更新しました';
        useToastStore.getState().show({
          type: 'success',
          message: message,
        });

        // 更新後、ホームにリダイレクト
        // 成功時は遷移完了まで送信中表示を維持する（遷移中の再送信を防ぐ）
        router.push('/');
      } catch (error) {
        exceptErrorHandling(error, showError);
        setSubmittingStatus(null);
      }
    },
    [router, showError, postId, initialSlug, queryClient]
  );

  return {
    isLoading,
    submittingStatus,
    onSubmit,
  };
}

export default usePostEditSubmit;
