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

// Per-page tags come from each page.json's root props via pageMetadata(); this
// is the fallback for routes that don't set their own.
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
      {/* Header, footer and the store assistant are editable blocks now, so
          each page.json carries its own chrome rather than the layout doing
          it. Keeps what the editor shows identical to what the route ships. */}
      <body className="font-body antialiased bg-background text-foreground m-0 p-0 flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
