// Gooseless design tokens
// Warm dark green + sand/gold — matches the login prototype exactly

export const C = {
  // Backgrounds
  bg:       '#0c1f21',
  bg2:      '#102325',
  bg3:      '#163433',
  surface:  'rgba(255,255,255,0.04)',
  surface2: 'rgba(255,255,255,0.07)',

  // Borders
  border:   'rgba(255,255,255,0.07)',
  border2:  'rgba(229,193,158,0.18)',

  // Text
  text:     '#F7F3EC',
  muted:    'rgba(247,243,236,0.45)',
  muted2:   'rgba(247,243,236,0.25)',

  // Accent — sand/gold
  accent:   '#E5C19E',
  accent2:  '#E98110',
  accentBg: 'rgba(229,193,158,0.10)',
  accentBorder: 'rgba(229,193,158,0.25)',

  // Status
  green:    '#4caf7d',
  greenBg:  'rgba(76,175,125,0.12)',
} as const;

export const R = {
  sm:   10,
  md:   14,
  lg:   18,
  pill: 99,
} as const;
