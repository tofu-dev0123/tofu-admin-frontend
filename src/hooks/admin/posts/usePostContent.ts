'use client';

import { useState, useCallback } from 'react';

export function usePostContent() {
  const [content, setContentState] = useState('');

  const setContent = useCallback((newContent: string) => {
    setContentState(newContent);
  }, []);

  return { content, setContent };
}
