'use client';

import { useState, useCallback } from 'react';

export function useOnClickPreview() {
  const [isPreview, setIsPreview] = useState(false);

  const togglePreview = useCallback(() => {
    setIsPreview((prev) => !prev);
  }, []);

  return { isPreview, togglePreview };
}
