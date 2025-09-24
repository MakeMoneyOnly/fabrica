'use client';

import { useEffect, useRef, useState } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import Header from '@/components/landing/Header';
import LogoCloud from '@/components/logo-cloud';
import Features from '@/components/features-11';
import ServicesSection from '@/components/services-section';
import ContentSection from '@/components/content-3';
import FAQsTwo from '@/components/faqs-2';
import FooterSection from '@/components/footer';
import ClientsProjectsSection from '@/components/ClientsProjectsSection';
import PricingSection from '@/components/landing/PricingSection';
import { wrapContentWithScrollBlurItem } from '@/components/ui/wrapContentWithScrollBlurItem';

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const clientsProjectsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const [heroBlurred, setHeroBlurred] = useState(true);
  const [clientsBlurred, setClientsBlurred] = useState(true);
  const [servicesBlurred, setServicesBlurred] = useState(true);
  const [contentBlurred, setContentBlurred] = useState(true);
  const [pricingBlurred, setPricingBlurred] = useState(true);
  const [faqsBlurred, setFaqsBlurred] = useState(true);
  const [footerBlurred, setFooterBlurred] = useState(true);

  useEffect(() => {
    const updateBlurStates = () => {
      const checkBlur = (ref: React.RefObject<HTMLDivElement>) => {
        if (!ref.current) return true;
        const rect = ref.current.getBoundingClientRect();
        // Blurred if top is below 80% of viewport
        return rect.top > window.innerHeight * 0.8;
      };
      setHeroBlurred(checkBlur(heroRef));
      setClientsBlurred(checkBlur(clientsProjectsRef));
      setServicesBlurred(checkBlur(servicesRef));
      setContentBlurred(checkBlur(contentRef));
      setPricingBlurred(checkBlur(pricingRef));
      setFaqsBlurred(checkBlur(faqsRef));
      setFooterBlurred(checkBlur(footerRef));
    };

    let scroll: any = null;
    let cleanup: (() => void) | undefined;
    const initSmoothScrolling = async () => {
      const scrollElement = scrollRef.current;
      if (!scrollElement) return () => {};
      try {
        const LocomotiveScroll = (await import('locomotive-scroll')).default;
        scroll = new LocomotiveScroll({
          el: scrollElement,
          smooth: true,
          smoothMobile: true,
          multiplier: 1,
          lerp: 0.05,
          smartphone: { smooth: true },
          tablet: { smooth: true }
        });
        scroll.on('scroll', updateBlurStates);
        // Initial check
        setTimeout(updateBlurStates, 100);
        return () => scroll.destroy();
      } catch (error) {
        console.error('Failed to initialize smooth scrolling:', error);
        return () => {};
      }
    };
    initSmoothScrolling().then(fn => { cleanup = fn; });
    window.addEventListener('resize', updateBlurStates);
    return () => {
      if (cleanup) cleanup();
      window.removeEventListener('resize', updateBlurStates);
    };
  }, []);

  return (
    <>
      <Header />
      <div
        ref={scrollRef}
        className="relative m-0 p-0 min-h-screen"
        data-scroll-container
        id="scroll-container"
      >
        {/* Hero Section */}
        <div ref={heroRef} className="w-full min-h-screen" data-scroll-section>
          {wrapContentWithScrollBlurItem(<HeroSection nextSectionRef={clientsProjectsRef} />)}
        </div>
        {/* Clients and Projects Section */}
        <div ref={clientsProjectsRef} className="relative z-10 w-full" data-scroll-section data-scroll-target="#scroll-container">
          {wrapContentWithScrollBlurItem(<ClientsProjectsSection />)}
        </div>
        {/* Services Section */}
        <div ref={servicesRef} className="w-full min-h-screen" data-scroll-section>
          {wrapContentWithScrollBlurItem(<ServicesSection />)}
        </div>
        {/* Content Section */}
        <div ref={contentRef} className="relative z-30 w-full min-h-screen bg-white text-black flex items-center justify-center px-8 py-20" data-scroll-section data-scroll-target="#scroll-container">
          <div className="w-full max-w-7xl mx-auto">
            {wrapContentWithScrollBlurItem(<ContentSection />)}
          </div>
        </div>
        {/* Pricing Section */}
        <div ref={pricingRef} className="w-full" data-scroll-section>
          {wrapContentWithScrollBlurItem(<PricingSection />)}
        </div>
        {/* FAQs Section */}
        <div ref={faqsRef} className="w-full min-h-screen" data-scroll-section>
          {wrapContentWithScrollBlurItem(<FAQsTwo />)}
        </div>
        {/* Footer Section */}
        <div ref={footerRef} className="relative z-50 w-full bg-white text-black px-8 py-20 pb-32" data-scroll-section>
          <div className="w-full max-w-7xl mx-auto">
            {wrapContentWithScrollBlurItem(<FooterSection />)}
          </div>
        </div>
      </div>
    </>
  );
}
