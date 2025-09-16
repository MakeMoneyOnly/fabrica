/**
 * Ethiopian Design System Hooks
 * Provides RTL support, connectivity detection, and PWA capabilities
 * optimized for Ethiopian creator platform
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { ethiopianTokens, spacing } from './design-tokens';

// RTL (Right-to-Left) Support Hook for Amharic
export function useRTL(direction: 'ltr' | 'rtl' | 'auto' = 'auto') {
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    if (direction === 'auto') {
      // Detect language and set RTL accordingly
      const userLanguage = navigator.language.toLowerCase();
      const url = window.location.pathname;

      // Ethiopian languages that use RTL or special handling
      const rtlLanguages = ['am', 'ar', 'am-et'];
      const hasAmharicInUrl = url.includes('/am/');
      const hasArabicInUrl = url.includes('/ar/');

      const shouldBeRTL = rtlLanguages.some(lang =>
        userLanguage.includes(lang) || hasAmharicInUrl || hasArabicInUrl
      );

      setIsRTL(shouldBeRTL);
    } else {
      setIsRTL(direction === 'rtl');
    }
  }, [direction]);

  return {
    isRTL,
    direction: isRTL ? 'rtl' : 'ltr'
  };
}

// Online/Offline Detection Hook - Critical for Ethiopian Network Conditions
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionSpeed, setConnectionSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    // Initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Monitor connection speed and type
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;

      const updateConnectionInfo = () => {
        // Detect Ethiopian typical connection speeds
        if (connection.effectiveType) {
          setConnectionType(connection.effectiveType);
        }

        // Ethiopian network optimization based on speed
        if (connection.downlink && connection.downlink < 1) {
          setConnectionSpeed('slow');
        } else if (connection.downlink && connection.downlink < 3) {
          setConnectionSpeed('medium');
        } else {
          setConnectionSpeed('fast');
        }
      };

      updateConnectionInfo();
      connection.addEventListener('change', updateConnectionInfo);

      return () => {
        connection.removeEventListener('change', updateConnectionInfo);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    } else {
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return {
    isOnline,
    connectionSpeed,
    connectionType,
    isSlowConnection: connectionSpeed === 'slow',
    isEthiopianNetwork: connectionType.includes('2g') || connectionSpeed === 'slow', // Ethiopian specific assumption
  };
}

// PWA Installation Hook
export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const installPromptHandler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', installPromptHandler);

    // Listen for successful installation
    const appInstalledHandler = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', appInstalledHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', installPromptHandler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  const installPWA = useCallback(async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    setDeferredPrompt(null);
    setIsInstallable(false);
  }, [deferredPrompt]);

  return {
    isInstallable,
    isInstalled,
    installPWA,
  };
}

// Ethiopian Cultural Context Hook
export function useEthiopianContext() {
  const [locale, setLocale] = useState('en-ET'); // Default Ethiopian English
  const [calendar, setCalendar] = useState<'gregorian' | 'ethiopian'>('gregorian');

  useEffect(() => {
    // Detect Ethiopian user preferences
    const savedLocale = localStorage.getItem('ethiopian-locale');
    if (savedLocale) {
      setLocale(savedLocale);
    }

    const savedCalendar = localStorage.getItem('ethiopian-calendar') as 'gregorian' | 'ethiopian';
    if (savedCalendar) {
      setCalendar(savedCalendar);
    }
  }, []);

  const updateLocale = (newLocale: string) => {
    setLocale(newLocale);
    localStorage.setItem('ethiopian-locale', newLocale);
  };

  const updateCalendar = (newCalendar: 'gregorian' | 'ethiopian') => {
    setCalendar(newCalendar);
    localStorage.setItem('ethiopian-calendar', newCalendar);
  };

  return {
    locale,
    calendar,
    updateLocale,
    updateCalendar,
    isAmharic: locale.startsWith('am'),
    isEthiopianCalendar: calendar === 'ethiopian',
  };
}

// Ethiopian Network Adaptive Component Hook
export function useAdaptiveLayout() {
  const { connectionSpeed } = useNetworkStatus();

  // Return spacing and sizing based on connection speed
  const getAdaptiveSpacing = useCallback((property: keyof typeof spacing) => {
    if (connectionSpeed === 'slow') {
      return ethiopianTokens.networkSpacing.slow[property] || spacing[property];
    } else {
      return ethiopianTokens.networkSpacing.fast[property] || spacing[property];
    }
  }, [connectionSpeed]);

  return {
    ConnectionSpeed: connectionSpeed,
    getAdaptiveSpacing,
    useReducedAnimations: connectionSpeed === 'slow',
    spacing,
  };
}

// Ethiopian Data Saving Hook
export function useDataSaving(enabled: boolean = true) {
  const { isSlowConnection, isEthiopianNetwork } = useNetworkStatus();

  // Automatically enable data saving based on Ethiopian conditions
  const shouldEnableDataSaving = enabled && (isSlowConnection || isEthiopianNetwork);

  return {
    shouldEnableDataSaving,
    isSlowConnection,
    isEthiopianNetwork,
  };
}

// Ethiopian Error Recovery Hook
export function useEthiopianErrorRecovery() {
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { isOnline } = useNetworkStatus();

  const handleError = useCallback((error: Error) => {
    setError(error);
    console.error('Ethiopian Platform Error:', error);
  }, []);

  const retry = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setError(null);
      // Ethiopian specific retry logic with backoff
      setTimeout(() => {
        // Retry logic here
      }, Math.pow(2, retryCount) * 1000); // Exponential backoff
    }
  }, [retryCount]);

  const reset = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  return {
    error,
    hasError: !!error,
    isOnline,
    retryCount,
    canRetry: retryCount < 3 && isOnline,
    handleError,
    retry,
    reset,
  };
}
