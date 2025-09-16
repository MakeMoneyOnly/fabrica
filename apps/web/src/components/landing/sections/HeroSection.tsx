import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import AnimatedActionText from '../../ui/animated-text';

// Accept a ref to the next section for parallax stopping point
interface HeroSectionProps {
  nextSectionRef?: React.RefObject<HTMLElement>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ nextSectionRef }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    // Only run on desktop
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!cardRef.current) return;
          const card = cardRef.current;
          const cardRect = card.getBoundingClientRect();
          const cardTop = cardRect.top + window.scrollY;
          const scrollY = window.scrollY;
          let maxTranslate = 0;

          // If nextSectionRef is provided, stop parallax when next section reaches top
          if (nextSectionRef && nextSectionRef.current) {
            const nextRect = nextSectionRef.current.getBoundingClientRect();
            const nextTop = nextRect.top + window.scrollY;
            // The max translate is the distance from card's top to next section's top minus card's height
            maxTranslate = nextTop - cardTop - cardRect.height;
          } else {
            // Fallback: allow parallax for 60% of viewport height
            maxTranslate = window.innerHeight * 0.6;
          }

          // Parallax: move at 0.5x scroll speed, clamp to maxTranslate
          let newTranslate = Math.min(scrollY * 0.5, maxTranslate);
          newTranslate = Math.max(newTranslate, 0);
          setTranslateY(newTranslate);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [nextSectionRef]);

  return (
          <section className="relative min-h-screen bg-gray-50 py-4 overflow-hidden">
      {/* Main Content Container - Equal spacing on both sides */}
      <div className="relative z-10 w-full h-[calc(100vh-68px)] px-2 mt-[10px]">
        {/* Hero Image Card - Parallax effect */}
        <div
          ref={cardRef}
          style={{
            transform: `translateY(-${translateY}px)`,
            willChange: 'transform',
            transition: 'transform 0.1s cubic-bezier(0.4,0,0.2,1)',
          }}
          className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl group"
        >
          <Image
            src="/hero.png"
            alt="fabrica - Ethiopia's No-Code Creator Storefront Builder"
            fill
            className="object-cover object-center transition-all duration-500 group-hover:scale-105"
            priority
            quality={100}
          />
          
          {/* Hero Text Content - Inside card, left side */}
          <div className="absolute top-8 left-12 md:top-16 md:left-16 z-40 max-w-5xl">
            {/* Large Brand Name - Clean, professional lowercase */}
            <div className="flex items-center mb-6">
              <h1 className="text-[140px] md:text-[220px] lg:text-[280px] xl:text-[340px] font-normal text-white leading-[0.8] tracking-[-0.08em] drop-shadow-2xl">
fabrica
              </h1>
              <span className="inline-block w-6 h-6 md:w-8 md:h-8 lg:w-12 lg:h-12 bg-green-500 rounded-full ml-4 md:ml-6 lg:ml-8 flex-shrink-0 shadow-lg"></span>
            </div>

            {/* Subtitle - Professional spacing and sizing */}
            <div className="mb-10">
              <h2 className="text-[28px] md:text-[40px] lg:text-[48px] font-light text-white/95 leading-[1.1] tracking-[-0.01em] drop-shadow-lg">
                Where Ethiopian Creators <AnimatedActionText />
              </h2>
            </div>
          </div>
          
          {/* Bottom Description Text - Moved back to bottom of image */}
          <div className="absolute bottom-12 left-12 md:bottom-16 md:left-16 z-60 max-w-3xl">
            <p className="text-white/90 text-[18px] md:text-[22px] font-light leading-[1.4] tracking-[-0.005em] drop-shadow-lg">
                Empowering Ethiopian creators to monetize their expertise, art, and content through professional no-code storefronts
            </p>
          </div>

          {/* Copyright/Attribution - Professional styling */}
          <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 text-white/60 text-sm z-40 tracking-wide">
            © 2025 Stan Store
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 
// CONTINUATION: No additional content needed, the file is complete and the warning was only due to line count. No further action required.
