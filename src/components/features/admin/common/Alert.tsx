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
}: AlertProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleAction = () => {
    onAction?.();
    // 非同期制御を親に委ねる場合（isActionLoading を渡す）は親の open で閉じる
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
          >
            {isActionLoading ? (
              <>
                <Spinner />
                アップロード中...
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
