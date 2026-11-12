'use client';

import { Milestone, Plus, GripVertical, Pencil, Trash2 } from 'lucide-react';
import type useTimelines from '@/hooks/admin/about/useTimelines';
import TimelineForm from '@/components/features/admin/about/TimelineForm';
import { MESSAGES } from '@/constants/messages';

interface TimelineSectionProps {
  timelinesHooks: ReturnType<typeof useTimelines>;
}

/** 年表カード（一覧・追加・インライン編集・削除） */
function TimelineSection({ timelinesHooks }: TimelineSectionProps) {
  const {
    timelines,
    editingId,
    form,
    isSubmitting,
    startAdd,
    startEdit,
    cancelEdit,
    handleFormChange,
    submit,
    openDelete,
  } = timelinesHooks;

  const isEmpty = timelines.length === 0 && editingId !== 'new';

  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Milestone className="h-[18px] w-[18px]" />
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-[15px] font-semibold text-foreground">
              年表
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {timelines.length}
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">経歴・出来事</p>
          </div>
        </div>
        <button
          type="button"
          onClick={startAdd}
          disabled={editingId === 'new'}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> 年表を追加
        </button>
      </div>

      {/* 新規追加フォーム */}
      {editingId === 'new' && (
        <div className="border-b border-border/60">
          <TimelineForm
            mode="new"
            form={form}
            isSubmitting={isSubmitting}
            onChange={handleFormChange}
            onSubmit={submit}
            onCancel={cancelEdit}
          />
        </div>
      )}

      {isEmpty ? (
        <p className="px-6 py-10 text-center text-sm text-muted-foreground">
          {MESSAGES.about.timeline.empty}
        </p>
      ) : (
        <ul className="divide-y divide-border/60">
          {timelines.map((timeline) =>
            editingId === timeline.timeline_id ? (
              <li key={timeline.timeline_id}>
                <TimelineForm
                  mode="edit"
                  form={form}
                  isSubmitting={isSubmitting}
                  onChange={handleFormChange}
                  onSubmit={submit}
                  onCancel={cancelEdit}
                />
              </li>
            ) : (
              <li
                key={timeline.timeline_id}
                className="group flex items-start gap-3 px-4 py-4 transition-colors hover:bg-accent/40"
              >
                <span className="mt-1 text-border">
                  <GripVertical className="h-5 w-5" />
                </span>
                <span className="mt-0.5 inline-flex h-7 items-center rounded-md bg-primary px-2.5 text-xs font-semibold tabular-nums text-primary-foreground">
                  {timeline.year}
                </span>
                <div className="min-w-0 flex-1">
                  {timeline.title && (
                    <p className="text-sm font-medium text-foreground">
                      {timeline.title}
                    </p>
                  )}
                  {timeline.body && (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {timeline.body}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => startEdit(timeline)}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    title="編集"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openDelete(timeline.timeline_id)}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="削除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </section>
  );
}

export default TimelineSection;
