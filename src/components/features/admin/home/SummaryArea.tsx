import { FileText, CheckCircle2, FilePenLine } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SummaryAreaProps {
  totalPosts?: number;
  publishedPosts?: number;
  draftPosts?: number;
}

interface SummaryCard {
  label: string;
  description: string;
  value: number;
  icon: LucideIcon;
  iconClassName: string;
}

function SummaryArea({
  totalPosts = 0,
  publishedPosts = 0,
  draftPosts = 0,
}: SummaryAreaProps) {
  const cards: SummaryCard[] = [
    {
      label: '投稿数',
      description: 'すべての記事',
      value: totalPosts,
      icon: FileText,
      iconClassName: 'bg-blue-50 text-blue-600',
    },
    {
      label: '公開中',
      description: '公開済みの記事',
      value: publishedPosts,
      icon: CheckCircle2,
      iconClassName: 'bg-green-50 text-green-600',
    },
    {
      label: '下書き',
      description: '未公開の記事',
      value: draftPosts,
      icon: FilePenLine,
      iconClassName: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {card.label}
              </p>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.iconClassName}`}
              >
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default SummaryArea;
