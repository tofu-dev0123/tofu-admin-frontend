import { Suspense } from 'react';
import AboutSection from '@/components/features/admin/about/AboutSection';
import AboutMainSkeleton from '@/components/features/admin/about/AboutMainSkeleton';

export default function Page() {
  return (
    <Suspense fallback={<AboutMainSkeleton />}>
      <AboutSection />
    </Suspense>
  );
}
