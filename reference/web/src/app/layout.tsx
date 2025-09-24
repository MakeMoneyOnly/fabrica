import './globals.css';
import { Inter } from 'next/font/google';
import BlurOnScroll from '@/components/ui/BlurOnScroll';
import { LocomotiveScrollProvider } from '@/components/ui/LocomotiveScrollContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Meqenet Docs',
  description: 'API Documentation for Meqenet BNPL',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-[#f7fdfc]'}>
        <LocomotiveScrollProvider>
          <BlurOnScroll>{children}</BlurOnScroll>
        </LocomotiveScrollProvider>
      </body>
    </html>
  );
}
