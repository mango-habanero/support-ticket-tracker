import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { Toaster } from '@/components/ui/sonner';

import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
};

export const metadata: Metadata = {
  description: 'A minimal ticket tracker built with Next.js and Spring Boot.',
  title: 'Ticket Tracker',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
      <html className={poppins.variable} lang="en">
      <body className="font-sans antialiased">
      <NuqsAdapter>{children}</NuqsAdapter>
      <Toaster />
      </body>
      </html>
  );
}