import './globals.css';
import { Inter } from 'next/font/google';
import BlurOnScroll from '@/components/ui/BlurOnScroll';
import { LocomotiveScrollProvider } from '@/components/ui/LocomotiveScrollContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Meqenet - Buy Now, Pay Later for Ethiopia',
  description: 'Empowering Ethiopian consumers with flexible, interest-free payment options. Shop now and pay later with Meqenet BNPL.',
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
