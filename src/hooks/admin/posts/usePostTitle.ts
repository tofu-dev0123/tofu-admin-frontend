'use client';

import { useState, useCallback } from 'react';

export function usePostTitle() {
  const [title, setTitleState] = useState('');

  const setTitle = useCallback((newTitle: string) => {
    setTitleState(newTitle);
  }, []);

  return { title, setTitle };
}
