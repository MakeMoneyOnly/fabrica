"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

// Context to provide Locomotive Scroll's scrollY and a trigger for children
const LocomotiveScrollContext = createContext<{ scrollY: number; trigger: number }>({ scrollY: 0, trigger: 0 });

export function useLocomotiveScroll() {
  return useContext(LocomotiveScrollContext);
}

export function LocomotiveScrollProvider({ children }: { children: React.ReactNode }) {
  const [scrollY, setScrollY] = useState(0);
  const [trigger, setTrigger] = useState(0);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    let scrollInstance: any = null;
    let cleanup: (() => void) | undefined;
    const initSmoothScrolling = async () => {
      try {
        const LocomotiveScroll = (await import('locomotive-scroll')).default;
        scrollInstance = new LocomotiveScroll({
          el: document.getElementById("scroll-container"),
          smooth: true,
          smoothMobile: true,
          multiplier: 1,
          lerp: 0.05,
          smartphone: { smooth: true },
          tablet: { smooth: true }
        });
        scrollInstance.on('scroll', (obj: any) => {
          setScrollY(obj.scroll.y);
          setTrigger(t => t + 1); // force update for all listeners
        });
        return () => scrollInstance.destroy();
      } catch (error) {
        return () => {};
      }
    };
    initSmoothScrolling().then(fn => { cleanup = fn; });
    return () => { if (cleanup) cleanup(); };
  }, []);

  return (
    <LocomotiveScrollContext.Provider value={{ scrollY, trigger }}>
      {children}
    </LocomotiveScrollContext.Provider>
  );
}
