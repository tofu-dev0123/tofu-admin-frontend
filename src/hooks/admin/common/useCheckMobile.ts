'use client';

import { useState, useEffect } from 'react';
import { DISPLAY_SIZE } from '@/constants/admin/displaySize';

function useCheckMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < DISPLAY_SIZE.MOBILE);
    };
    checkMobile();
  }, []);
  return isMobile;
}

export default useCheckMobile;
