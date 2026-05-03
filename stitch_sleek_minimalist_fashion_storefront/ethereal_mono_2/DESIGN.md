---
name: Ethereal Mono
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#494738'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#7a7766'
  outline-variant: '#cbc7b3'
  surface-tint: '#676007'
  primary: '#676007'
  on-primary: '#ffffff'
  primary-container: '#fdf38f'
  on-primary-container: '#756f18'
  inverse-primary: '#d2c96a'
  secondary: '#964735'
  on-secondary: '#ffffff'
  secondary-container: '#fd9982'
  on-secondary-container: '#762f1f'
  tertiary: '#5c5e67'
  on-tertiary: '#ffffff'
  tertiary-container: '#efeffa'
  on-tertiary-container: '#6b6c75'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#efe583'
  primary-fixed-dim: '#d2c96a'
  on-primary-fixed: '#1f1c00'
  on-primary-fixed-variant: '#4d4800'
  secondary-fixed: '#ffdad3'
  secondary-fixed-dim: '#ffb4a4'
  on-secondary-fixed: '#3d0600'
  on-secondary-fixed-variant: '#783021'
  tertiary-fixed: '#e1e2ec'
  tertiary-fixed-dim: '#c5c6d0'
  on-tertiary-fixed: '#191b23'
  on-tertiary-fixed-variant: '#45464f'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  headline-xl:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 40px
  gutter: 24px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is an exercise in "Soft Minimalism"—a blend of high-end editorial clarity and organic, approachable geometry. It targets a sophisticated audience that values both precision and playfulness. The aesthetic is anchored by extreme corner radii that mimic the fluidity of water or the softness of tactile objects, contrasting with a monochromatic foundation and moments of high-chroma accents.

The emotional response should be one of "Structured Calm." It uses heavy whitespace and elegant serif typography to establish authority, while the "capsule" shapes and vibrant accent blocks provide a sense of movement and contemporary energy. The design language is influenced by modern wellness brands: clean, translucent, and physically inviting.

## Colors

The palette is built on a foundation of pure whites and deep charcoals to maintain the "Mono" aesthetic, punctuated by "Sunlight Yellow" and "Soft Coral" accents. 

- **Primary:** A luminous yellow used for large-scale container blocks and high-impact messaging cards.
- **Secondary:** A warm coral reserved for primary call-to-action "capsule" buttons, creating a distinct visual hierarchy against the yellow.
- **Tertiary:** A desaturated lavender/grey used for subtle background layering and navigation bars.
- **Neutral:** A near-black for typography to ensure maximum legibility and an editorial feel.

Color application should be intentional: large surfaces use the primary yellow or tertiary lavender, while the secondary coral is strictly for interaction triggers.

## Typography

This design system utilizes a high-contrast typographic pairing. **Noto Serif** provides an elegant, literary backbone for headlines, suggesting quality and heritage. It should be used for all major titles and value propositions.

**Inter** serves as the functional counterpart, used for body copy and navigational elements. It provides a clean, neutral balance to the serif's personality. Labels and button text should utilize the "label-caps" style—bold, uppercase, and tracked out—to provide a technical, "Mono" feel within the otherwise soft interface.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model with generous internal safe areas. Content is organized within a 12-column grid, but components are treated as "floating blocks" rather than rigid segments. 

The rhythm is dictated by an 8px base unit. Wide margins (minimum 40px on desktop) are essential to maintain the ethereal, airy feel. Vertical rhythm should prioritize large "stack-lg" gaps between major sections to prevent the UI from feeling cluttered, allowing the high-roundness shapes enough room to breathe.

## Elevation & Depth

Depth is achieved through **Tonal Layers** and **Low-Contrast Outlines** rather than traditional shadows. Surfaces are stacked to create hierarchy:
- **Level 0 (Background):** Solid white or very faint grey.
- **Level 1 (Cards/Nav):** The tertiary lavender or primary yellow blocks. These should feel "set into" the background rather than floating above it.
- **Level 2 (Buttons):** High-contrast color blocks (Coral) that demand immediate attention.

Avoid heavy shadows. If depth is required for a floating element (like a modal), use an extremely diffused, low-opacity (5-8%) neutral shadow with a wide spread to maintain the "soft" light-themed aesthetic.

## Shapes

Shape is the defining characteristic of this design system. 
- **Cards and Containers:** Must use a minimum of 24px (rounded-xl) and up to 40px for larger sections. This creates a friendly, organic container for the sharp typography.
- **Buttons and Chips:** Must be fully "Capsule" or "Pill" shaped (border-radius: 9999px). 
- **Icons:** Should follow a medium stroke weight with rounded terminals to match the container language.

The interplay between the hard lines of the "Mono" labels and the hyper-roundness of the containers creates the system's unique visual tension.

## Components

### Buttons
Primary buttons are coral-colored "capsules." Text inside should be the "label-caps" style in the neutral dark color. Secondary buttons use a ghost style with a 1px neutral border or a light grey fill, always maintaining the pill shape.

### Cards
Cards are the primary vehicle for content. Feature cards (like the yellow style) use high-padding (32px+) and 24px+ corners. Content within cards should be center-aligned to lean into the organic, "bubbled" feel.

### Navigation Bar
The navigation bar should be a floating capsule with a light background (Tertiary lavender at 80% opacity) and a subtle backdrop blur. Links are displayed in the "label-caps" style for a technical, modern appearance.

### Input Fields
Inputs follow the capsule shape of buttons but use a light grey fill and a subtle 1px border. Focus states are indicated by a 1px border shift to the primary yellow color, avoiding heavy glow effects.

### Chips & Tags
Small, pill-shaped indicators used for categories. These should use the same font treatment as buttons but at a smaller scale, with minimal padding to keep them tight and functional.