'use client';

import { Pencil, Plus, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

type TimelineField = 'year' | 'title' | 'body' | 'sortOrder';

interface TimelineFormProps {
  mode: 'new' | 'edit';
  form: { year: string; title: string; body: string; sortOrder: string };
  isSubmitting: boolean;
  onChange: (
    field: TimelineField
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

/** 年表の追加・編集フォーム（インライン表示） */
function TimelineForm({
  mode,
  form,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel,
}: TimelineFormProps) {
  return (
    <div className="bg-muted/40 px-4 py-4 ring-1 ring-inset ring-border">
      <div className="flex items-center gap-2 pb-3 text-xs font-semibold text-muted-foreground">
        {mode === 'new' ? (
          <Plus className="h-3.5 w-3.5" />
        ) : (
          <Pencil className="h-3.5 w-3.5" />
        )}
        {mode === 'new' ? '新規追加' : '編集中'}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[110px_1fr]">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            年 (year)
          </label>
          <Input
            type="number"
            min={1900}
            max={2100}
            value={form.year}
            onChange={onChange('year')}
            placeholder="2024"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            タイトル (title)
          </label>
          <Input
            type="text"
            maxLength={255}
            value={form.title}
            onChange={onChange('title')}
            placeholder="出来事のタイトル"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            本文 (body)
          </label>
          <Textarea
            rows={2}
            maxLength={2000}
            value={form.body}
            onChange={onChange('body')}
            placeholder="補足の説明"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            並び順 (sort_order)
          </label>
          <Input
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={onChange('sortOrder')}
          />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          キャンセル
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : <Check />}
          保存
        </Button>
      </div>
    </div>
  );
}

export default TimelineForm;
