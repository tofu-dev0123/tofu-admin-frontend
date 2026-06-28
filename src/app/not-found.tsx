import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100/50 px-4 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">ページが見つかりません</h1>
        <p className="text-sm text-muted-foreground">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
      </div>
      <Button asChild>
        <Link href="/">ホームへ戻る</Link>
      </Button>
    </div>
  );
}
