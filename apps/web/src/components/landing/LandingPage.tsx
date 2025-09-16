'use client';

import { useRef, useEffect } from 'react';

// Landing page section components
import Header from './Header';
import HeroSection from './sections/HeroSection';
import ClientsProjectsSection from './sections/ClientsProjectsSection';
import ServicesSection from './sections/ServicesSection';
import PlatformFeaturesSection from './sections/PlatformFeaturesSection';
import PricingSection from './sections/PricingSection';
import PlatformFaqSection from './sections/PlatformFaqSection';
import FooterSection from './sections/FooterSection';

/**
 * LandingPage - Main landing page composition component
 *
 * This component orchestrates all landing page sections with proper
 * scroll animations, blur effects, and locomotive scroll integration.
 *
 * Architecture:
 * - Each section is independently maintainable
 * - Scroll performance optimized with individual refs
 * - Progressive blur effects for smooth UX
 * - Z-index layering for visual depth
 */
export default function LandingPage() {
  // Scroll refs for locomotive scroll integration
  const scrollRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const clientsProjectsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll blur effect implementation
    const updateBlur = () => {
      const sections = document.querySelectorAll('.blur-section');
      const viewportHeight = window.innerHeight;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();

        // Element is in viewport (with some buffer) - clear
        if (rect.top >= -rect.height * 0.5 && rect.bottom <= viewportHeight + rect.height * 0.5) {
          section.classList.remove('blurred');
        } else {
          // Element is outside viewport - blur
          section.classList.add('blurred');
        }
      });
    };

    // Initial calculation
    updateBlur();

    // Listen for scroll events
    window.addEventListener('scroll', updateBlur);

    // Also listen to Locomotive Scroll if available
    let locomotiveInstance: any = null;
    try {
      locomotiveInstance = (window as any).locomotiveScroll;
      if (locomotiveInstance && locomotiveInstance.on) {
        locomotiveInstance.on('scroll', updateBlur);
      }
    } catch (error) {
      // Silently handle locomotive scroll not available in development environments
    }

    // Locomotive Scroll initialization
    let scroll: any = null;
    let scrollCleanup: (() => void) | undefined;
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
        return () => scroll.destroy();
      } catch (error) {
        // Silently handle smooth scrolling initialization failures in development environments
        return () => {};
      }
    };
    initSmoothScrolling().then(fn => { scrollCleanup = fn; });

    return () => {
      window.removeEventListener('scroll', updateBlur);
      if (locomotiveInstance && locomotiveInstance.off) {
        locomotiveInstance.off('scroll', updateBlur);
      }
      if (scrollCleanup) scrollCleanup();
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
      {/* Hero Section - Always clear */}
      <div ref={heroRef} className="w-full min-h-screen" data-scroll-section>
        <HeroSection nextSectionRef={clientsProjectsRef} />
      </div>

      {/* Clients and Projects Section - Blur/outside viewport */}
      <div ref={clientsProjectsRef} className="relative z-10 w-full blur-section" data-scroll-section data-scroll-target="#scroll-container">
        <ClientsProjectsSection />
      </div>

      {/* Services Section - Blur/outside viewport */}
      <div ref={servicesRef} className="w-full min-h-screen blur-section" data-scroll-section>
        <ServicesSection />
      </div>

      {/* Content Section - Progressive blur */}
      <div ref={contentRef} className="relative z-30 w-full min-h-screen bg-white text-black flex items-center justify-center px-8 py-20 blur-section" data-scroll-section data-scroll-target="#scroll-container">
        <div className="w-full max-w-7xl mx-auto">
          <PlatformFeaturesSection />
        </div>
      </div>

      {/* Pricing Section - Progressive blur */}
      <div ref={pricingRef} className="w-full blur-section" data-scroll-section>
        <PricingSection />
      </div>

      {/* FAQs Section - Progressive blur */}
      <div ref={faqsRef} className="w-full min-h-screen blur-section" data-scroll-section>
        <PlatformFaqSection />
      </div>

      {/* Footer Section - Progressive blur */}
      <div ref={footerRef} className="relative z-50 w-full bg-white text-black px-8 py-20 pb-32 blur-section" data-scroll-section>
        <div className="w-full max-w-7xl mx-auto">
          <FooterSection />
        </div>
      </div>
    </div>
    </>
  );
}
