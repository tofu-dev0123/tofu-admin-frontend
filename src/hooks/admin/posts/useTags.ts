'use client';

import { useState, useCallback } from 'react';

interface UseTagsProps {
  initialTags?: string[];
}

export function useTags({ initialTags }: UseTagsProps = {}) {
  const [inputValue, setInputValue] = useState('');
  const [tags, setTagsState] = useState<string[]>(
    initialTags && initialTags.length > 0 ? initialTags : []
  );

  const addTag = useCallback(() => {
    if (!inputValue.trim()) return;
    setTagsState((prev) => [...prev, inputValue]);
    setInputValue('');
  }, [inputValue]);

  const removeTag = useCallback((tag: string) => {
    setTagsState((prev) => prev.filter((t) => t !== tag));
  }, []);

  return { tags, addTag, removeTag, inputValue, setInputValue };
}
