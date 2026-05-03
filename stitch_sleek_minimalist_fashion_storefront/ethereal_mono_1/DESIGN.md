---
name: Ethereal Mono
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e3e2e2'
  on-secondary-container: '#646464'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1b'
  on-tertiary-container: '#838483'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e3e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#e2e3e1'
  tertiary-fixed-dim: '#c6c7c5'
  on-tertiary-fixed: '#1a1c1b'
  on-tertiary-fixed-variant: '#454746'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: Noto Serif
    fontSize: 4.5rem
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 3rem
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 2rem
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.7'
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.15em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  section-gap: 128px
---

## Brand & Style

The brand identity centers on timeless luxury and quiet confidence. This design system targets an affluent, discerning audience that values substance over trends and finds beauty in restraint. The emotional response is one of calm, exclusivity, and precision.

The visual style is **Minimalism** with an editorial influence. It prioritizes the "void"—using generous whitespace to frame high-fashion photography like art in a gallery. Every UI element is intentionally thin and delicate, ensuring that the interface never competes with the product. The aesthetic leans into a "Modern Classic" look, where traditional serif elegance meets the efficiency of digital-first sans-serifs.

## Colors

The palette is strictly monochromatic to maintain an atmosphere of high-end sophistication. 

- **Primary (Pure Black):** Reserved for core branding, primary headlines, and high-emphasis calls to action.
- **Secondary (Muted Slate):** Used for body text and secondary labels to reduce visual vibration and improve long-form readability.
- **Tertiary (Paper White):** A warm, soft gray used for subtle section backgrounds and decorative borders, providing a "paper-like" feel that avoids the harshness of pure white.
- **Neutral (Optical White):** The base canvas color, ensuring the interface feels airy and expansive.

## Typography

This design system utilizes a high-contrast typographic pairing to evoke an editorial, "lookbook" feel.

- **Headlines:** Noto Serif is the primary voice. It should be used with tight tracking and generous leading. Large display sizes are preferred to create a sense of scale.
- **Body & UI:** Inter provides a functional, neutral counterpoint. It is spaced generously to ensure clarity even at smaller sizes.
- **Labels:** Small caps with increased letter spacing are used for navigation and categorisation to differentiate them from body content without increasing weight.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model for large screens, transitioning to fluid behavior on mobile devices. 

A 12-column grid is the standard for desktop, with exceptionally wide margins (64px) to emphasize exclusivity. The rhythm is defined by a "Section Gap" (128px), which forces the user to pause and appreciate one content block at a time. Elements should rarely feel crowded; if in doubt, increase the whitespace. Horizontal rules (1px width) are used sparingly to separate primary content sections.

## Elevation & Depth

To maintain a minimalist aesthetic, this design system rejects traditional shadows. Depth is conveyed through **Tonal Layers** and **Low-Contrast Outlines**.

- **Surfaces:** All elements are flat. Depth is achieved by placing pure white elements (#FFFFFF) on top of tertiary gray backgrounds (#F5F5F3).
- **Outlines:** Ghost borders (1px, #E0E0E0) define functional areas like input fields or product cards without adding visual weight.
- **Interactivity:** Hover states are signaled by subtle opacity shifts or the appearance of a hairline underline, rather than lifting the element off the page.

## Shapes

The shape language is strictly **Sharp (0)**. 

The use of 90-degree angles reflects the precision of tailoring and architectural design. Rectilinear buttons and containers ground the elegant typography in a modern, structural framework. Circular elements should only be used for functional icons or specific decorative image treatments to create a deliberate contrast with the otherwise rigid grid.

## Components

### Buttons
Primary buttons are solid black with white text in `label-caps`. Secondary buttons are "Ghost" style: 1px black border with no fill. All buttons use sharp corners and significant horizontal padding.

### Input Fields
Fields consist of a single bottom-border (hairline) rather than a full box, minimizing visual noise. The label sits above the line in `label-caps`.

### Product Cards
Cards feature no border and no shadow. The focus is entirely on the image, with product details (Name, Price) left-aligned in `body-md` and `label-caps` respectively.

### Navigation
A top-bar navigation that remains transparent until scroll. Links are styled in `label-caps` with a 1px underline that appears only on hover.

### Filter Chips
Small, sharp-edged boxes with a 1px border. When selected, the chip fills with pure black and the text flips to white.

### Additional Components
- **Full-Screen Image Hero:** Used for new collections, featuring centered `headline-xl` typography.
- **Vertical Scroller:** A thin, 2px wide scroll indicator to replace standard browser scrollbars.