// Swatch configuration for product option pickers.
//
// Shopify exposes a `swatch` on each option value, but plenty of products ship
// without one configured. These settings decide which options render as colour
// circles and what colour to use when the API doesn't supply one.

// Option names (case-insensitive) rendered as colour circles instead of pills.
export const SWATCH_OPTION_NAMES = ['color', 'colour'];

// Fallback colours, keyed by lowercased option value name. The first group
// mirrors hexes the store defines on other products, so a product missing its
// swatches still matches the ones that have them. Add your own names here.
export const SWATCH_COLORS: Record<string, string> = {
  clay: '#5a4b3c',
  green: '#81a69b',
  ocean: '#768da0',
  olive: '#7f8060',
  purple: '#766589',
  red: '#a88084',

  beige: '#e8dcc8',
  black: '#000000',
  blue: '#2563eb',
  brown: '#7c5c40',
  burgundy: '#6d2532',
  charcoal: '#36393d',
  cream: '#f3ead8',
  gold: '#c9a227',
  gray: '#8a8d91',
  grey: '#8a8d91',
  ivory: '#f6f2e6',
  khaki: '#a89d78',
  lavender: '#b9a8d0',
  mint: '#a8d5ba',
  navy: '#1f2a44',
  orange: '#e2733a',
  pink: '#e3a7b5',
  sand: '#d9c9a8',
  silver: '#c4c6c8',
  stone: '#a9a294',
  tan: '#c8a882',
  teal: '#3f8f8b',
  white: '#ffffff',
  yellow: '#e5c34a',
};

export const swatchColorForName = (name: string): string | undefined =>
  SWATCH_COLORS[name.trim().toLowerCase()];

export const isSwatchOptionName = (name: string): boolean =>
  SWATCH_OPTION_NAMES.includes(name.trim().toLowerCase());
