import React from "react";
import ScrollBlurItem from "./ScrollBlurItem";

/**
 * Enhanced wrapper for precise content targeting.
 * Wraps all text, paragraphs, headings, spans, and other content elements with ScrollBlurItem.
 * Special focus on Logo Cloud, Projects text, Why Choose Us section, and Integration section.
 */
export function wrapContentWithScrollBlurItem(children: React.ReactNode): React.ReactNode {
  if (!children) return null;
  
  // Handle arrays (multiple children)
  if (Array.isArray(children)) {
    return children.map((child, i) => wrapContentWithScrollBlurItem(child));
  }
  
  // Handle text/numbers directly
  if (typeof children === "string" || typeof children === "number") {
    return <ScrollBlurItem>{children}</ScrollBlurItem>;
  }
  
  if (React.isValidElement(children)) {
    // Skip if already a ScrollBlurItem
    if (children.type === ScrollBlurItem || (children.type as any)?.displayName === "ScrollBlurItem") {
      return children;
    }
    
    // Check for key section className indicators
    const className = children.props.className || '';
    const isBlackCard = typeof className === 'string' && (className.includes('bg-black') || className.includes('rounded-3xl'));
    
    // Specific component name checks for targeted wrapping
    const componentName = (children.type as any)?.name || '';
    const isTargetedComponent = 
      componentName === 'LogoCloud' || 
      componentName === 'IntegrationsSection' ||
      componentName === 'ResultsSection';
    
    // Specific text content checks (for "Projects", "Why choose us", etc.)
    const textContent = typeof children.props.children === 'string' ? children.props.children : '';
    const isTargetedText = 
      textContent.includes('Projects') || 
      textContent.includes('Why choose us') || 
      textContent.includes('Proven results') ||
      textContent.includes('with a focus on design');
      
    // Elements that should always be wrapped
    const elementType = children.type.toString();
    const isDirectContentElement = 
      children.type === 'p' || 
      children.type === 'h1' || 
      children.type === 'h2' || 
      children.type === 'h3' || 
      children.type === 'h4' || 
      children.type === 'h5' || 
      children.type === 'h6' || 
      children.type === 'img' ||
      children.type === 'span' ||
      children.type === 'a' ||
      children.type === 'button' ||
      (typeof children.type === 'string' && (
        elementType.startsWith('h') || 
        elementType.includes('text') || 
        elementType.includes('title') ||
        elementType.includes('heading')
      ));
    
    // If this is a direct content element or specifically targeted text/component
    if (isDirectContentElement || isTargetedText || isTargetedComponent) {
      return <ScrollBlurItem>{children}</ScrollBlurItem>;
    }
    
    // For black cards and containers, don't wrap the container itself
    if (isBlackCard) {
      if (children.props && children.props.children) {
        return React.cloneElement(children, {}, wrapContentWithScrollBlurItem(children.props.children));
      }
      return children;
    }

    // Otherwise, keep traversing the tree
    if (children.props && children.props.children) {
      return React.cloneElement(children, {}, wrapContentWithScrollBlurItem(children.props.children));
    }
    return children;
  }
  
  return children;
}