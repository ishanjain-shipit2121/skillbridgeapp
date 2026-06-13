export const Colors = {
  // Core Dark Theme
  background: '#0A0E27',
  backgroundDark: '#050810',
  card: '#151B35',
  cardDark: '#0F1628',
  cardLight: '#1E2A47',
  
  // Primary Accents
  accent: '#6366F1',
  accentLight: '#818CF8',
  
  // Neon Colors for Tech Dark Mode
  neonCyan: '#00D9FF',
  neonGreen: '#00FF41',
  neonPink: '#FF006E',
  neonPurple: '#9D00FF',
  neonYellow: '#FFFF00',
  
  // Text
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textDim: '#475569',
  
  // Status Colors
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Borders & Dividers
  border: '#334155',
  borderLight: '#475569',
  borderDark: '#1E293B',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FontSizes = {
  body: 16,
  subtitle: 18,
  title: 22,
  heading: 28,
  display: 36,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const NeonGlows = {
  cyan: {
    shadowColor: Colors.neonCyan,
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  green: {
    shadowColor: Colors.neonGreen,
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  pink: {
    shadowColor: Colors.neonPink,
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  purple: {
    shadowColor: Colors.neonPurple,
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
};
