import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import { site } from '@/config/site';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.storeName,
    template: `%s — ${site.storeName}`,
  },
  description: site.description,
  openGraph: {
    type: 'website',
    siteName: site.storeName,
    title: site.storeName,
    description: site.description,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.storeName,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="font-body antialiased bg-background text-foreground m-0 p-0 flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
