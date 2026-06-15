import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ToastContainer from '@/components/toast/ToastContainer';
import { logo, subLogo } from '@/lib/font';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tofu Admin',
  description: 'Tofu 管理画面',
  robots: { index: false, follow: false },
  manifest: '/admin-manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`
          h-full
          ${logo.variable}
          ${subLogo.variable}
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
        `}
      >
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
