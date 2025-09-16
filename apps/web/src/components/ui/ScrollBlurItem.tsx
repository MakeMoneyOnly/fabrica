"use client";
import React from "react";

/**
 * Simplified ScrollBlurItem - maintained for backward compatibility
 * This component is no longer used directly, we use wrapContentWithScrollBlurItem instead
 */
const ScrollBlurItem = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default ScrollBlurItem;
