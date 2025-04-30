import type { Metadata } from 'next';
import { StackProvider } from '@stackframe/stack';
import { stackServerApp } from '../stack';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { CustomStackTheme } from '@/components/CustomStackTheme';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '五四班登录系统',
  description: '五四班统一身份认证平台',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StackProvider app={stackServerApp} lang="zh-CN">
          <ThemeProvider>
            <CustomStackTheme>
              {children}
            </CustomStackTheme>
          </ThemeProvider>
        </StackProvider>
      </body>
    </html>
  );
}
