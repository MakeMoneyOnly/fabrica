"use client";
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

// Context to provide Locomotive Scroll's scrollY and a trigger for children
const LocomotiveScrollContext = createContext<{ scrollY: number; trigger: number }>({ scrollY: 0, trigger: 0 });

export function useLocomotiveScroll() {
  return useContext(LocomotiveScrollContext);
}

export function LocomotiveScrollProvider({ children }: { children: React.ReactNode }) {
  const [scrollY, setScrollY] = useState(0);
  const [trigger, setTrigger] = useState(0);
  const scrollInstanceRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  const handleScroll = useCallback((obj: any) => {
    setScrollY(obj.scroll.y);
    setTrigger(t => t + 1); // force update for all listeners
  }, []);

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    let cleanup: (() => void) | undefined;

    const initSmoothScrolling = async () => {
      try {
        // Wait for DOM to be ready
        if (!document.getElementById("scroll-container")) {
          // Try again after a short delay
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        const container = document.getElementById("scroll-container");
        if (!container) {
          console.warn('Scroll container not found');
          return () => {};
        }

        const LocomotiveScroll = (await import('locomotive-scroll')).default;
        const scrollInstance = new LocomotiveScroll({
          el: container,
          smooth: true,
          multiplier: 1,
          lerp: 0.05
        });

        scrollInstanceRef.current = scrollInstance;
        scrollInstance.on('scroll', handleScroll);

        return () => {
          if (scrollInstance) {
            scrollInstance.destroy();
          }
        };
      } catch (error) {
        console.error('Failed to initialize Locomotive Scroll:', error);
        return () => {};
      }
    };

    initSmoothScrolling().then(fn => { cleanup = fn; });

    return () => {
      if (cleanup) cleanup();
      isInitializedRef.current = false;
    };
  }, [handleScroll]);

  return (
    <LocomotiveScrollContext.Provider value={{ scrollY, trigger }}>
      {children}
    </LocomotiveScrollContext.Provider>
  );
}
