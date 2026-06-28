'use client';

import { useRouter } from 'next/navigation';

function Logo() {
  const router = useRouter();

  const handleClickLogo = () => {
    router.push('/');
  };

  return (
    <button
      type="button"
      onClick={handleClickLogo}
      className="flex items-center gap-2 cursor-pointer"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
        T
      </span>
      <span className="text-lg font-bold tracking-tight">Tofu Blog</span>
    </button>
  );
}

export default Logo;
