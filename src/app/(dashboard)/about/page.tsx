import AboutSection from '@/components/features/admin/about/AboutSection';

// 取得はクライアントで行う（TanStack Query）。取得中のスケルトンは AboutSection が出す
export default function Page() {
  return <AboutSection />;
}
