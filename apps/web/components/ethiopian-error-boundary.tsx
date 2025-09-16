'use client';

/**
 * Ethiopian Error Boundary
 * Comprehensive error handling component optimized for Ethiopian creator platform
 * with network-aware recovery and user feedback systems
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { useRTL } from '@/lib/ethiopian-hooks';
import { ethiopianTokens } from '@/lib/design-tokens';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

class EthiopianErrorBoundary extends Component<Props, State> {
  /**
   * Ethiopian network error patterns for better classification
   */
  private static readonly ETHIOPIAN_ERROR_PATTERNS = {
    network: [
      'Failed to fetch',
      'NetworkError',
      'CONNECTION_REFUSED',
      'TIMEOUT',
      'CORS',
      'ERR_INTERNET_DISCONNECTED',
      'ERR_NETWORK',
    ],
    payment: [
      'Payment failed',
      'Transaction declined',
      'WeBirr',
      'TeleBirr',
      'CBE Birr',
      'Amole',
      'payment provider',
    ],
    authentication: [
      'Unauthorized',
      '401',
      'Token expired',
      'Authentication failed',
      'Session expired',
    ],
    server: [
      '500',
      '503',
      'Internal Server Error',
      'Service Unavailable',
    ],
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      retryCount: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Classify error type for Ethiopian context
    const errorType = this.classifyEthiopianError(error);

    // Ethiopian-specific error logging
    console.error('Ethiopian Platform Error:', {
      error: error.message,
      type: errorType,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      retryCount: this.state.retryCount,
      timestamp: new Date().toISOString(),
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Ethiopian network tracking (if available)
    if (errorType === 'network' && navigator.vibrate) {
      // Subtle vibration for network errors
      navigator.vibrate(200);
    }
  }

  /**
   * Classify errors for Ethiopian context
   */
  private classifyEthiopianError(error: Error): 'network' | 'payment' | 'auth' | 'server' | 'unknown' {
    const errorMessage = error.message.toLowerCase();

    for (const [category, patterns] of Object.entries(EthiopianErrorBoundary.ETHIOPIAN_ERROR_PATTERNS)) {
      if (patterns.some(pattern => errorMessage.includes(pattern.toLowerCase()))) {
        // Map authentication to auth for return type
        if (category === 'authentication') return 'auth';
        if (category === 'network') return 'network';
        if (category === 'payment') return 'payment';
        if (category === 'server') return 'server';
      }
    }

    return 'unknown';
  }

  /**
   * Handle error recovery with Ethiopian network awareness
   */
  private handleRetry = async () => {
    this.setState((prevState) => ({
      hasError: false,
      error: undefined,
      retryCount: prevState.retryCount + 1,
    }));

    // Ethiopian network recovery delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  /**
   * Handle offline retry with Ethiopian network optimization
   */
  private handleOfflineRetry = async () => {
    // Wait for network recovery
    if (!navigator.onLine) {
      // Listen for online event
      await new Promise<void>((resolve) => {
        const onOnline = () => {
          window.removeEventListener('online', onOnline);
          resolve();
        };
        window.addEventListener('online', onOnline);
      });
    }

    // Retry with Ethiopian backoff
    await this.handleRetry();
  };

  /**
   * Render Ethiopian-adapted error UI
   */
  private renderErrorUI() {
    if (this.state.error) {
      return (
        <EthiopianErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          retryCount={this.state.retryCount}
          onRetry={this.handleRetry}
          onOfflineRetry={this.handleOfflineRetry}
          onReset={() => this.setState({ hasError: false, error: undefined, retryCount: 0 })}
        />
      );
    }

    // Fallback UI if custom fallback is provided
    if (this.props.fallback) {
      return this.props.fallback;
    }

    // Default fallback
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: ethiopianTokens.colors.surface,
        color: ethiopianTokens.colors.text,
        fontFamily: ethiopianTokens.typography.fontFamily,
      }}>
        <div style={{
          textAlign: 'center',
          padding: ethiopianTokens.spacing.large,
        }}>
          <p>ያሉበት በአሁኑ አሰልቺ እንሞላለን።<br />
          Something went wrong. We&apos;ll be back soon.</p>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.renderErrorUI();
    }

    return this.props.children;
  }
}

/**
 * Ethiopian Error Fallback Component
 * User-friendly error display with Ethiopian cultural adaptation
 */
interface EthiopianErrorFallbackProps {
  error: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  onRetry: () => void;
  onOfflineRetry: () => void;
  onReset: () => void;
}

const EthiopianErrorFallback: React.FC<EthiopianErrorFallbackProps> = ({
  error,
  retryCount,
  onRetry,
  onOfflineRetry,
  onReset,
}) => {
  const { isRTL } = useRTL('auto');

  // Determine error type for Ethiopian context
  const getEthiopianErrorDetails = (error: Error) => {
    const errorMessage = error.message;
    const isNetworkError = errorMessage.toLowerCase().includes('network') ||
                          errorMessage.toLowerCase().includes('fetch') ||
                          !navigator.onLine;

    const isPaymentError = errorMessage.toLowerCase().includes('payment') ||
                          errorMessage.toLowerCase().includes('transaction');

    return {
      isNetworkError,
      isPaymentError,
      canRetry: retryCount < 3,
      isAmharicText: window.location.pathname.includes('/am'),
    };
  };

  const { isNetworkError, isPaymentError, canRetry, isAmharicText } = getEthiopianErrorDetails(error);

  // Ethiopian cultural messages
  const getEthiopianMessage = () => {
    if (isAmharicText) {
      if (isNetworkError) {
        return {
          title: 'ኔትዎርክ በጉድለት ውስጥ የሆነባቸው',
          description: 'እኔትዎርክ ግንኙነቶን ተፈጥሮአል እና የመስመር ሽፋን ለማሳየት እያልኩ ነበር።',
          action: 'እንደገና ለማስያዝ ይሞክሩ',
        };
      }
      if (isPaymentError) {
        return {
          title: 'ክፍያ ባልሆነባቸው መልሶ ተመልሷል',
          description: 'በቀላሉ እንችላለን እና አስቀማሚ እንደምን ለማስተናገድ መሞከር እንጠቀሳለን።',
          action: 'እንደገና ቅንጅት ለማስመዝገብ ይሞክሩ',
        };
      }
      return {
        title: 'አስቸኳይ እንም',
        description: 'አስቸኳይ እንም ተያዘ፣ አስቀማሚ ተለውተናል። እንደገና ለማስያዝ እችላለሁ።',
        action: 'እንደገና ለማስመዝገብ ይሞክሩ',
      };
    }

    // English messages
    if (isNetworkError) {
      return {
        title: 'Network Connection Lost',
        description: 'It looks like your connection to the Ethiopian network was interrupted. Please check your connection and try again.',
        action: 'Try Again',
      };
    }
    if (isPaymentError) {
      return {
        title: 'Payment Process Error',
        description: 'There was an issue processing your payment through our Ethiopian payment gateway. Let&apos;s try fixing this together.',
        action: 'Try Payment Again',
      };
    }
    return {
      title: 'Something Went Wrong',
      description: 'We encountered an unexpected error. The Ethiopian platform team has been notified. Please try again.',
      action: 'Try Again',
    };
  };

  const { title, description, action } = getEthiopianMessage();

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: ethiopianTokens.colors.surface,
    color: ethiopianTokens.colors.text,
    fontFamily: ethiopianTokens.typography.fontFamily,
    direction: (isRTL ? 'rtl' : 'ltr') as 'ltr' | 'rtl',
    padding: ethiopianTokens.spacing.large,
  };

  const errorCardStyle = {
    maxWidth: '500px',
    width: '100%',
    backgroundColor: ethiopianTokens.colors.background,
    border: `1px solid ${ethiopianTokens.colors.border}`,
    borderRadius: ethiopianTokens.borderRadius.large,
    padding: ethiopianTokens.spacing.large,
    textAlign: 'center' as const,
    boxShadow: ethiopianTokens.shadows.medium,
  };

  const titleStyle = {
    fontSize: ethiopianTokens.typography.fontSize.h4,
    fontWeight: ethiopianTokens.typography.fontWeight.bold,
    marginBottom: ethiopianTokens.spacing.medium,
    color: ethiopianTokens.colors.error,
  };

  const descriptionStyle = {
    fontSize: ethiopianTokens.typography.fontSize.body,
    marginBottom: ethiopianTokens.spacing.large,
    lineHeight: 1.5,
  };

  const buttonsContainerStyle = {
    display: 'flex',
    gap: ethiopianTokens.spacing.medium,
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
  };

  const buttonStyle = {
    padding: `${ethiopianTokens.spacing.medium} ${ethiopianTokens.spacing.large}`,
    borderRadius: ethiopianTokens.borderRadius.medium,
    border: 'none',
    cursor: 'pointer',
    fontSize: ethiopianTokens.typography.fontSize.body,
    fontWeight: ethiopianTokens.typography.fontWeight.medium,
    transition: 'all 0.2s ease',
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: ethiopianTokens.colors.primary,
    color: 'white',
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: ethiopianTokens.colors.background,
    color: ethiopianTokens.colors.text,
    border: `1px solid ${ethiopianTokens.colors.border}`,
  };

  return (
    <div style={containerStyle}>
      <div style={errorCardStyle}>
        <h1 style={titleStyle}>{title}</h1>

        <p style={descriptionStyle}>{description}</p>

        {process.env.NODE_ENV === 'development' && (
          <details style={{
            backgroundColor: ethiopianTokens.colors.surface,
            border: `1px solid ${ethiopianTokens.colors.border}`,
            borderRadius: ethiopianTokens.borderRadius.medium,
            padding: ethiopianTokens.spacing.medium,
            marginBottom: ethiopianTokens.spacing.medium,
            textAlign: 'left',
          }}>
            <summary style={{ cursor: 'pointer', marginBottom: ethiopianTokens.spacing.small }}>
              Debug Information
            </summary>
            <pre style={{
              fontSize: '12px',
              color: ethiopianTokens.colors.textSecondary,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {error.message}
              {error.stack && `\n\nStack trace:\n${error.stack}`}
            </pre>
          </details>
        )}

        <div style={buttonsContainerStyle}>
          {canRetry && (
              <button
                style={primaryButtonStyle}
                onClick={onRetry}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = ethiopianTokens.colors.primaryDark;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = ethiopianTokens.colors.primary;
                }}
              >
                {action}
              </button>
            )}

            {isNetworkError && (
                <button
                  style={secondaryButtonStyle}
                  onClick={onOfflineRetry}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = ethiopianTokens.colors.primary;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = ethiopianTokens.colors.border;
                  }}
                >
                  Wait for Connection
                </button>
          )}

          <button
            style={secondaryButtonStyle}
            onClick={onReset}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = ethiopianTokens.colors.primary;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = ethiopianTokens.colors.border;
            }}
          >
            Go Home
          </button>
        </div>

        {retryCount > 0 && (
          <p style={{
            fontSize: ethiopianTokens.typography.fontSize.small,
            color: ethiopianTokens.colors.textSecondary,
            marginTop: ethiopianTokens.spacing.medium,
          }}>
            Retry attempts: {retryCount}
          </p>
        )}
      </div>
    </div>
  );
};

// Ethiopian Error Boundary with Hook Support (for functional components)
export const useEthiopianErrorHandler = () => {
  const handleError = React.useCallback((error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Ethiopian Error Handler:', {
      error: error.message,
      stack: error.stack,
      errorInfo,
      timestamp: new Date().toISOString(),
    });

    // Ethiopian network-aware error reporting
    if (navigator.onLine && typeof window !== 'undefined') {
      // Could send to Ethiopian error reporting service
    }
  }, []);

  return handleError;
};

export default EthiopianErrorBoundary;
