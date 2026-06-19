import { getThemePreset, type ThemeTokens } from 'mtse-shared/storefront';

/** A theme preset's tokens with the owner's accent override resolved in. */
export interface ResolvedTheme extends ThemeTokens {
  /** Effective accent — owner override, falling back to the preset primary. */
  accent: string;
}

export function resolveTheme(templateId: string, accentColor?: string): ResolvedTheme {
  const preset = getThemePreset(templateId);
  return {
    ...preset.tokens,
    accent: accentColor || preset.tokens.primary,
  };
}

/** Shared button style derived from the theme (solid, accent-filled). */
export function primaryButton(theme: ResolvedTheme): React.CSSProperties {
  return {
    background: theme.accent,
    color: theme.onPrimary,
    border: 'none',
    borderRadius: theme.buttonRadius,
    padding: '14px 32px',
    fontFamily: theme.bodyFont,
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    cursor: 'pointer',
  };
}

/** Ghost / secondary button style. */
export function ghostButton(theme: ResolvedTheme): React.CSSProperties {
  return {
    background: 'transparent',
    color: theme.onBackground,
    border: `1px solid ${theme.onBackground}`,
    borderRadius: theme.buttonRadius,
    padding: '13px 31px',
    fontFamily: theme.bodyFont,
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    cursor: 'pointer',
  };
}

export const labelCaps: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 600,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
};
