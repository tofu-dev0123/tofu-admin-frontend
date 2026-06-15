import { Roboto, Noto_Serif_JP } from 'next/font/google';

export const logo = Roboto({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-logo',
  display: 'swap',
});

export const subLogo = Noto_Serif_JP({
  weight: ['400', '600', '700'],
  variable: '--font-sub-logo',
  display: 'swap',
});
