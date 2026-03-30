import { Platform } from 'react-native';

export const Typography = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif' }),
  sans: Platform.select({ ios: 'System', android: 'sans-serif' }),

  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    hero: 40,
  },

  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};
