import { AlertCircle } from 'lucide-react';
import { MESSAGES } from '@/constants/messages';
import { cn } from '@/lib/utils';

interface SectionErrorProps {
  message?: string;
  className?: string;
}

/**
 * サーバー取得（Section）に失敗した領域だけに表示するインラインのエラー表示。
 * 1領域の失敗で全画面が落ちないようにするために使う。
 */
function SectionError({
  message = MESSAGES.errors.common.failed,
  className,
}: SectionErrorProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-6 text-sm text-muted-foreground',
        className
      )}
    >
      <AlertCircle className="h-4 w-4 text-destructive" />
      {message}
    </div>
  );
}

export default SectionError;
