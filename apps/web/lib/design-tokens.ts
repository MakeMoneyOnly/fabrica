// Stan Store Windsurf - Ethiopian Design System Tokens
// Optimized for Ethiopian creator platform with mobile-first, Ethiopian content consideration

// Color Scheme - Ethiopian Inspired (Blue-Green based on Ethiopian flag)
export const colors = {
  // Ethiopian Primary Colors
  ethiopian: {
    blue: {
      50: '#eff7ff',   // Light Ethiopian blue
      100: '#dbeafe',  // Very light Ethiopian blue
      200: '#bfdbfe',  // Light Ethiopian blue
      300: '#93c5fd',  // Medium Ethiopian blue
      400: '#60a5fa',  // Standard Ethiopian blue
      500: '#3b82f6',  // Primary Ethiopian blue
      600: '#2563eb',  // Dark Ethiopian blue
      700: '#1d4ed8',  // Very dark Ethiopian blue
      800: '#1e40af',  // Deep Ethiopian blue
      900: '#1e3a8a',  // Ultra dark Ethiopian blue
    },
    green: {
      50: '#f0fdf4',   // Light Ethiopian green
      100: '#dcfce7',  // Very light Ethiopian green
      200: '#bbf7d0',  // Light Ethiopian green
      300: '#86efac',  // Medium Ethiopian green
      400: '#4ade80',  // Standard Ethiopian green
      500: '#22c55e',  // Primary Ethiopian green
      600: '#16a34a',  // Dark Ethiopian green
      700: '#15803d',  // Very dark Ethiopian green
      800: '#166534',  // Deep Ethiopian green
      900: '#14532d',  // Ultra dark Ethiopian green
    },
    yellow: '#fcd34d', // Ethiopian gold/yellow accent
  },

  // Status Colors - Universally Recognizable
  status: {
    success: '#22c55e',  // Green for success
    warning: '#f59e0b',  // Amber for warnings
    error: '#ef4444',   // Red for errors
    info: '#3b82f6',    // Blue for information
  },

  // Social Media Colors - Optimized for Creator Platform
  social: {
    telegram: '#0088cc',   // Ethiopian creators favorite
    instagram: '#e4405f',  // Popular for fashion/content
    youtube: '#ff0000',    // Popular for educational content
    tiktok: '#000000',     // Popular for Ethiopian youth
  },

  // Payment Provider Colors
  payment: {
    telebirr: '#e53e3e',   // TeleBirr red
    weBirr: '#2563eb',     // WeBirr blue
    cbeBirr: '#16a34a',    // CBE green
    amole: '#f59e0b',      // Amole orange
  },

  // Ethiopian Cultural Colors
  cultural: {
    coffee: '#8b4513', // Ethiopian coffee color
    gold: '#ffd700',    // Gold for Ethiopian Orthodox Church
    injera: '#d4b08a',  // Light brown for injera
    birr: '#1f2937',    // Gray for currency
  }
};

// Typography Scale - Optimized for Small Screens & Ethiopian Fonts
export const typography = {
  // Font Families - Ethiopian Friendly
  fonts: {
    primary: ['Inter', 'system-ui', 'sans-serif'], // Default Latin/English
    amharic: ['"Noto Sans Ethiopic"', '"Abyssinica SIL"', 'sans-serif'], // Amharic fonts
    secondary: ['serif'], // For accents
  },

  // Ethiopian Font Sizes - Mobile Optimized
  sizes: {
    xxs: '0.75rem', // 12px
    xs: '0.875rem',  // 14px
    sm: '1rem',      // 16px - Base mobile size
    md: '1.125rem',  // 18px
    lg: '1.25rem',   // 20px
    xl: '1.375rem',  // 22px
    '2xl': '1.5rem', // 24px
    '3xl': '1.625rem', // 26px
    '4xl': '1.875rem', // 30px
    '5xl': '2.25rem',  // 36px
    '6xl': '3rem',    // 48px
  },

  // Line Heights - Optimized for Readability on Mobile
  lineHeights: {
    tight: 1.1,
    snug: 1.2,
    normal: 1.3,
    relaxed: 1.4,
    loose: 1.6,
  },

  // Font Weights - Standard Scale
  weights: {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
};

// Spacing Scale - Ethiopian Mobile Screen Optimization
export const spacing = {
  // Ethiopian Touch-Friendly Spacing
  0: '0',        // 0px
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px - Base Ethiopian size
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  32: '8rem',      // 128px
  40: '10rem',     // 160px
  48: '12rem',     // 192px
  56: '14rem',     // 224px
  64: '16rem',     // 256px
};

// Border Radius - Ethiopian Design Inspired Curation
export const borderRadius = {
  none: '0',       // Sharp edges for formal elements
  sm: '0.125rem',  // 2px - Subtle rounding
  md: '0.375rem',  // 6px - Ethiopian inspired rounding
  lg: '0.5rem',    // 8px - Standard rounding
  xl: '0.75rem',   // 12px - Prominent rounding
  '2xl': '1rem',   // 16px - Large rounding
  '3xl': '1.5rem', // 24px - Very large rounding
  full: '9999px',  // Fully rounded
};

// Shadows - Optimized for Text and UI Elements
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};

// Ethiopian-Specific Design Tokens
export const ethiopianTokens = {
  // Ethiopian Special Characters
  currency: 'ETB',
  thousandsSeparator: ',',
  decimalSeparator: '.',
  dateFormat: 'DD/MM/YYYY', // Ethiopian calendar when implemented

  // Ethiopian Text Edge Cases
  amharicTest: 'ሰላም አለም!', // Hello World in Amharic
  fallbackText: 'Hello World', // English fallback

  // Ethiopian Color Psychology
  cultural: {
    prosperity: '#22c55e', // Green for prosperity
    authority: '#1d4ed8',  // Blue for trust/authority
    celebration: '#f59e0b', // Gold for celebration
    alert: '#ef4444',       // Red for alerts (not too aggressive)
  },

  // Mobile Touch Guidelines - Ethiopian Device Optimization
  touchTargets: {
    minimum: '44px',  // iOS Human Interface Guidelines
    recommended: '48px', // Ethiopian optimal touch size
  },

  // Network-Responsive Spacing - Ethiopian Connectivity Consideration
  networkSpacing: {
    fast: spacing, // Full spacing for good connections
    slow: {
      ...spacing,
      // Reduced padding and margins for low bandwidth
      2: '0.125rem', // Smaller gaps
      3: '0.25rem',
      4: '0.5rem',   // Smaller base size
    }
  },
};

// Design System Constant Export
export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  ethiopianTokens,
};

// Tailwind Configuration Export for Ethiopian Theme
export const tailwindEthiopianTheme = {
  extend: {
    colors: {
      ethiopian: colors.ethiopian,
      status: colors.status,
      social: colors.social,
      payment: colors.payment,
      cultural: colors.cultural,
    },
    fontFamily: {
      'amharic': typography.fonts.amharic,
      'primary': typography.fonts.primary,
    },
    fontSize: typography.sizes,
    fontWeight: typography.weights,
    lineHeight: typography.lineHeights,
    spacing: spacing,
    borderRadius: borderRadius,
    boxShadow: shadows,
  },
};
