import './globals.css';
import { Inter } from 'next/font/google';

// Clean white luxurious font setup
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

export const metadata = {
  title: 'fabrica',
  description: 'The all-in-one platform for creators in Ethiopia.',
};

export const generateViewport = () => {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#ffffff',
  };
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme colors */}
        <meta name="color-scheme" content="light" />
      </head>
      <body className={`${inter.variable} bg-[#f7fdfc] text-gray-900 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
