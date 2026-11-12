'use client';

import { useCallback, useState } from 'react';
import { get, post, put, del } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import {
  Timeline,
  TimelineListResponse,
  TimelineRequest,
  TimelineResponse,
  TimelineDeleteResponse,
} from '@/types/api/about';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { useToastStore } from '@/stores/toastStore';
import { logger } from '@/lib/logger';
import { MESSAGES } from '@/constants/messages';

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
  initial: Timeline[];
  showError: (message: string[]) => void;
}

/**
 * 年表（Timeline）の一覧・追加・編集・削除。
 * 変更後は GET /admin/timelines で一覧を再取得して同期する。
 */
function useTimelines({ initial, showError }: UseTimelinesProps) {
  const [timelines, setTimelines] = useState<Timeline[]>(initial);
  const [editingId, setEditingId] = useState<EditingId>(null);
  const [form, setForm] = useState<TimelineFormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const refetch = useCallback(async () => {
    const response = await get<TimelineListResponse>(
      API_ENDPOINTS.timelines.get
    );
    setTimelines(response.timelines);
  }, []);

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
      setDeleteTarget(null);
    }
  }, [deleteTarget, refetch, showError]);

  return {
    timelines,
    editingId,
    form,
    isSubmitting,
    deleteTarget,
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
