'use client';

import { useCallback, useState } from 'react';
import { post, put } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { Product, ProductRequest, ProductResponse } from '@/types/api/product';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { useToastStore } from '@/stores/toastStore';
import { logger } from '@/lib/logger';
import { MESSAGES } from '@/constants/messages';

const MAX_TAGS = 20;
const MAX_TAG_LENGTH = 30;

interface ProductFormState {
  title: string;
  description: string;
  linkUrl: string;
  published: boolean;
  sortOrder: string;
  tags: string[];
}

const EMPTY_FORM: ProductFormState = {
  title: '',
  description: '',
  linkUrl: '',
  published: false,
  sortOrder: '0',
  tags: [],
};

interface UseProductFormProps {
  showError: (message: string[]) => void;
  // 保存成功時に一覧を再取得するためのコールバック
  onSaved: () => Promise<void> | void;
}

/**
 * プロダクトの作成・編集フォーム（スライドオーバー）。
 */
function useProductForm({ showError, onSaved }: UseProductFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'new' | 'edit'>('new');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreate = () => {
    setMode('new');
    setEditingId(null);
    setForm(EMPTY_FORM);
    setTagInput('');
    setIsOpen(true);
  };

  const openEdit = (product: Product) => {
    setMode('edit');
    setEditingId(product.product_id);
    setForm({
      title: product.title,
      description: product.description ?? '',
      linkUrl: product.link_url ?? '',
      published: product.published,
      sortOrder: String(product.sort_order),
      tags: product.tags.map((tag) => tag.name),
    });
    setTagInput('');
    setIsOpen(true);
  };

  const close = () => {
    if (isSubmitting) return;
    setIsOpen(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, title: e.target.value }));
  };
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, description: e.target.value }));
  };
  const handleLinkUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, linkUrl: e.target.value }));
  };
  const handleSortOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, sortOrder: e.target.value }));
  };
  const togglePublished = () => {
    setForm((prev) => ({ ...prev, published: !prev.published }));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    setForm((prev) => {
      if (
        prev.tags.length >= MAX_TAGS ||
        value.length > MAX_TAG_LENGTH ||
        prev.tags.includes(value)
      ) {
        return prev;
      }
      return { ...prev, tags: [...prev.tags, value] };
    });
    setTagInput('');
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const submit = useCallback(async () => {
    if (!form.title.trim()) {
      showError([MESSAGES.validation.product.titleRequired]);
      return;
    }
    setIsSubmitting(true);
    try {
      const request: ProductRequest = {
        title: form.title,
        description: form.description.trim() ? form.description : null,
        link_url: form.linkUrl.trim() ? form.linkUrl : null,
        published: form.published,
        sort_order: Number(form.sortOrder) || 0,
        tags: form.tags,
      };
      if (mode === 'new') {
        const response = await post<ProductResponse, ProductRequest>(
          API_ENDPOINTS.products.post,
          request
        );
        logger.info('[products] プロダクトを作成しました');
        useToastStore.getState().show({
          type: 'success',
          message: response.message,
        });
      } else if (editingId !== null) {
        const response = await put<ProductResponse, ProductRequest>(
          API_ENDPOINTS.products.put(editingId),
          request
        );
        logger.info('[products] プロダクトを更新しました', {
          productId: editingId,
        });
        useToastStore.getState().show({
          type: 'success',
          message: response.message,
        });
      }
      await onSaved();
      setIsOpen(false);
    } catch (error) {
      exceptErrorHandling(error, showError);
    } finally {
      setIsSubmitting(false);
    }
  }, [form, mode, editingId, onSaved, showError]);

  return {
    isOpen,
    mode,
    form,
    tagInput,
    isSubmitting,
    openCreate,
    openEdit,
    close,
    handleTitleChange,
    handleDescriptionChange,
    handleLinkUrlChange,
    handleSortOrderChange,
    togglePublished,
    handleTagInputChange,
    handleTagInputKeyDown,
    addTag,
    removeTag,
    submit,
  };
}

export default useProductForm;
