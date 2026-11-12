'use client';

import { useState, useCallback } from 'react';

export function usePostSlug() {
  const [slug, setSlugState] = useState('');

  const setSlug = useCallback((newSlug: string) => {
    setSlugState(newSlug);
  }, []);

  return { slug, setSlug };
}
