import type { Metadata } from 'next'
import './globals.css'
import { Geist_Mono } from 'next/font/google';
import LayoutProvider from '@/components/Providers/layout-provider';

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FoodFlow - Order Management System',
  description: 'A complete order management system for food delivery with real-time tracking and admin controls',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={geistMono.variable}>
      <body className="font-sans antialiased">
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  )
}
