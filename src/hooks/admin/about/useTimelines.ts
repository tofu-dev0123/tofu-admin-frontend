'use client';

import { useCallback, useState } from 'react';
import { post, put, del } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import {
  Timeline,
  TimelineRequest,
  TimelineResponse,
  TimelineDeleteResponse,
} from '@/types/api/about';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { useToastStore } from '@/stores/toastStore';
import { logger } from '@/lib/logger';
import { MESSAGES } from '@/constants/messages';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';

// 編集対象: 'new'（新規追加）/ number（既存 timeline_id）/ null（非編集）
type EditingId = number | 'new' | null;

interface TimelineFormState {
  year: string;
  title: string;
  body: string;
  sortOrder: string;
}

const EMPTY_FORM: TimelineFormState = {
  year: '',
  title: '',
  body: '',
  sortOrder: '0',
};

interface UseTimelinesProps {
  // クエリで取得済みの一覧（キャッシュ更新で最新に差し替わる）
  timelines: Timeline[];
  showError: (message: string[]) => void;
}

/**
 * 年表（Timeline）の一覧・追加・編集・削除。
 * 一覧はクエリ（useTimelinesQuery）のデータを使い、変更後はキャッシュを無効化して再取得する。
 */
function useTimelines({ timelines, showError }: UseTimelinesProps) {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<EditingId>(null);
  const [form, setForm] = useState<TimelineFormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 一覧のキャッシュを無効化して再取得する（完了まで待つ）
  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.timelines });
  }, [queryClient]);

  const startAdd = () => {
    setEditingId('new');
    setForm(EMPTY_FORM);
  };

  const startEdit = (timeline: Timeline) => {
    setEditingId(timeline.timeline_id);
    setForm({
      year: String(timeline.year),
      title: timeline.title ?? '',
      body: timeline.body ?? '',
      sortOrder: String(timeline.sort_order),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleFormChange =
    (field: keyof TimelineFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const submit = useCallback(async () => {
    const year = Number(form.year);
    if (!form.year || Number.isNaN(year)) {
      showError([MESSAGES.validation.timeline.year]);
      return;
    }
    setIsSubmitting(true);
    try {
      const request: TimelineRequest = {
        year,
        title: form.title.trim() ? form.title : null,
        body: form.body.trim() ? form.body : null,
        sort_order: Number(form.sortOrder) || 0,
      };
      if (editingId === 'new') {
        const response = await post<TimelineResponse, TimelineRequest>(
          API_ENDPOINTS.timelines.post,
          request
        );
        logger.info('[about] 年表を作成しました');
        useToastStore.getState().show({
          type: 'success',
          message: response.message,
        });
      } else if (typeof editingId === 'number') {
        const response = await put<TimelineResponse, TimelineRequest>(
          API_ENDPOINTS.timelines.put(editingId),
          request
        );
        logger.info('[about] 年表を更新しました', { timelineId: editingId });
        useToastStore.getState().show({
          type: 'success',
          message: response.message,
        });
      }
      await refetch();
      setEditingId(null);
      setForm(EMPTY_FORM);
    } catch (error) {
      exceptErrorHandling(error, showError);
    } finally {
      setIsSubmitting(false);
    }
  }, [form, editingId, refetch, showError]);

  const openDelete = (id: number) => setDeleteTarget(id);
  const closeDelete = () => setDeleteTarget(null);

  const confirmDelete = useCallback(async () => {
    if (deleteTarget === null) return;
    setIsDeleting(true);
    try {
      const response = await del<TimelineDeleteResponse>(
        API_ENDPOINTS.timelines.delete(deleteTarget)
      );
      logger.info('[about] 年表を削除しました', { timelineId: deleteTarget });
      useToastStore.getState().show({
        type: 'success',
        message: response.message,
      });
      await refetch();
    } catch (error) {
      exceptErrorHandling(error, showError);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, refetch, showError]);

  return {
    timelines,
    editingId,
    form,
    isSubmitting,
    deleteTarget,
    isDeleting,
    startAdd,
    startEdit,
    cancelEdit,
    handleFormChange,
    submit,
    openDelete,
    closeDelete,
    confirmDelete,
  };
}

export default useTimelines;
