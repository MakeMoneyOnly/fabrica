import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

export function wrapContentWithScrollBlurItem(children: React.ReactNode): React.ReactNode {
  return <ScrollBlurItemWrapper>{children}</ScrollBlurItemWrapper>;
}

const ScrollBlurItemWrapper = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Transform scroll progress to blur and opacity values
  const blurAmount = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [5, 0, 0, 5] // Start blurred, become clear, stay clear, become blurred again
  );

  const opacityValue = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.4, 1, 1, 0.4] // Start faded, become opaque, stay opaque, become faded again
  );

  // Use spring physics for smoother animations
  const springBlur = useSpring(blurAmount, {
    stiffness: 400,
    damping: 40,
    restDelta: 0.001
  });

  const springOpacity = useSpring(opacityValue, {
    stiffness: 400,
    damping: 40,
    restDelta: 0.001
  });

  // Create blur filter string
  const blurFilter = useMotionValue("blur(0px)");
  React.useEffect(() => {
    const unsubscribe = springBlur.on("change", (value) => {
      blurFilter.set(`blur(${value}px)`);
    });
    return unsubscribe;
  }, [springBlur, blurFilter]);

  return (
    <motion.div
      ref={ref}
      style={{
        filter: blurFilter,
        opacity: springOpacity,
      }}
      initial={{
        filter: "blur(5px)",
        opacity: 0.4
      }}
    >
      {children}
    </motion.div>
  );
};
