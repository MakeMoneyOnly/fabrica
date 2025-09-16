import React from "react";
import ScrollBlurItem from "./ScrollBlurItem";

// List of tag names to blur
const BLUR_TAGS = [
  "p", "h1", "h2", "h3", "h4", "h5", "h6", "span", "li", "img", "Image"
];

// List of class substrings to exclude (e.g., cards)
const EXCLUDE_CLASSES = [
  "bg-black", "bg-white", "rounded-xl", "card", "stat", "feature", "faq", "footer", "header"
];

/**
 * Recursively wraps all text and image elements with ScrollBlurItem for premium effect.
 * Skips card-like/container elements.
 */
export function wrapWithScrollBlurItem(children: React.ReactNode): React.ReactNode {
  if (!children) return null;
  if (Array.isArray(children)) {
    return children.map((child) => wrapWithScrollBlurItem(child));
  }
  if (typeof children === "string" || typeof children === "number") {
    return <ScrollBlurItem>{children}</ScrollBlurItem>;
  }
  if (React.isValidElement(children)) {
    const tag = typeof children.type === "string" ? children.type : (children.type as any)?.displayName || (children.type as any)?.name;
    const className = (children.props && children.props.className) || "";
    // Exclude cards/containers
    if (EXCLUDE_CLASSES.some(cls => className.includes(cls))) {
      return React.cloneElement(children, {
        children: children.props && children.props.children
          ? wrapWithScrollBlurItem(children.props.children)
          : children.props.children
      });
    }
    // Only wrap if tag is in BLUR_TAGS
    if (BLUR_TAGS.includes(tag)) {
      return (
        <ScrollBlurItem>
          {children.props && children.props.children
            ? React.cloneElement(children, {
                children: wrapWithScrollBlurItem(children.props.children),
              })
            : children}
        </ScrollBlurItem>
      );
    }
    // Otherwise, recurse
    return React.cloneElement(children, {
      children: children.props && children.props.children
        ? wrapWithScrollBlurItem(children.props.children)
        : children.props.children
    });
  }
  return children;
}
