import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { Spinner } from '@/components/ui/spinner';
import { MESSAGES } from '@/constants/messages';

interface AlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  cancelText?: string;
  actionText?: string;
  onCancel?: () => void;
  onAction?: () => void;
  previewImageUrl?: string | null;
  // 非同期アクションの実行中フラグ。渡された場合、閉じるタイミングは親が open で制御する。
  isActionLoading?: boolean;
  // 実行中にアクションボタンへ表示する文言
  loadingText?: string;
}

function Alert({
  open,
  onOpenChange,
  title = '警告',
  description = '',
  cancelText = 'キャンセル',
  actionText = '続ける',
  onCancel,
  onAction,
  previewImageUrl,
  isActionLoading,
  loadingText = MESSAGES.loading.uploading,
}: AlertProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 非同期制御を親に委ねる場合（isActionLoading を渡す）は、
    // AlertDialogAction の自動クローズを止めて親の open で閉じる（処理中表示を見せるため）
    if (isActionLoading !== undefined) e.preventDefault();
    onAction?.();
    if (isActionLoading === undefined) onOpenChange(false);
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        // アクション実行中はバックドロップ／ESC での閉じを抑止
        if (isActionLoading && !next) return;
        onOpenChange(next);
      }}
    >
      <AlertDialogContent className="lg:max-w-2xl w-11/12 rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
          {previewImageUrl && (
            <div className="mt-4 flex justify-center">
              <div className="relative w-full max-w-[400px] aspect-video rounded-lg overflow-hidden">
                <Image
                  src={previewImageUrl}
                  alt="プレビュー画像"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={handleCancel}
            disabled={!!isActionLoading}
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAction}
            disabled={!!isActionLoading}
            aria-busy={isActionLoading || undefined}
          >
            {isActionLoading ? (
              <>
                <Spinner aria-hidden="true" />
                {loadingText}
              </>
            ) : (
              actionText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Alert;
