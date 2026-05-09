// Design tokens — single source of truth for UTM brand colors and design values.
// Import from here instead of hardcoding hex strings in components.

export const colors = {
  // UTM brand
  green: '#009933',
  greenDark: '#00802b',
  gold: '#FFCC33',
  goldDark: '#996600',

  // Semantic
  danger: '#DC2626',
  dangerDark: '#B91C1C',

  // Text
  textPrimary: '#333333',
  textSecondary: '#666666',
  textMuted: '#999999',
  textDisabled: '#CCCCCC',

  // Borders
  border: '#E5E5E5',
  borderLight: '#F5F5F5',

  // Backgrounds
  bgGreen: '#E8F5E9',
  bgGold: '#FFF9E8',
  bgRed: '#FEF2F2',
  bgGray: '#F5F5F5',
  bgSurface: '#F9F9F9',
  bgWhite: '#FFFFFF',
};

export const fonts = {
  // Body font is set globally on <body> — only use this for explicit heading overrides
  heading: "'Trajan Pro Bold', 'Trajan Pro', serif",
};

// Tailwind-safe color variant map used by shared components
export const colorVariants = {
  green: { bg: colors.bgGreen, color: colors.green },
  gold:  { bg: colors.bgGold,  color: colors.gold  },
  gray:  { bg: colors.bgGray,  color: colors.textSecondary },
  red:   { bg: colors.bgRed,   color: colors.danger },
};
