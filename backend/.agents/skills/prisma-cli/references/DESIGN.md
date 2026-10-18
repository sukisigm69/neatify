# Design System Inspired by Artatix

## 1. Visual Theme & Atmosphere

Artatix embodies a modern, professional ticketing platform with a clean and trustworthy aesthetic. The design prioritizes clarity and accessibility while maintaining a premium feel through rich blues and spacious layouts. The visual language combines deep navy foundations with vibrant accent blues, creating a sense of reliability and innovation. The generous use of neutral backgrounds and whitespace promotes focus on content, while cohesive typography and consistent spacing create an organized, enterprise-grade experience. This is a system designed for seamless event discovery and ticket management, with visual confidence and straightforward usability at its core.

**Key Characteristics**
- Deep blue primary palette (`#213FC0`, `#152C8C`) conveying trust and professionalism
- Abundant neutral spaces (`#E2E8F0`, `#FFFFFF`, `#F8FAFC`) ensuring clarity and breathing room
- Rounded, soft component corners fostering approachability and modernity
- Consistent spacing system creating rhythm and visual hierarchy
- Semantic color coding for status feedback (warning in `#FFB000`, errors in `#BE1F0B`)
- Clean, accessible typography built on Plus Jakarta Sans for cross-platform legibility

## 2. Color Palette & Roles

### Primary
- **Deep Navy** (`#020817`): Primary text, critical UI elements, header backgrounds; the dominant dark tone appearing 76 times across the system
- **Navy Blue** (`#213FC0`): Primary interactive elements, button backgrounds, key brand accents
- **Vibrant Blue** (`#3259E8`): Secondary primary actions, hover states, emphasis

### Accent Colors
- **Light Blue** (`#C8DBFF`): Subtle background tints, form field states, low-emphasis containers
- **Deep Blue** (`#152C8C`): Dark variant for elevated containers, footer sections
- **Electric Blue** (`#0414A7`): Rare accent for special interactive states

### Interactive
- **Primary Button Blue** (`#213FC0`): Primary CTA buttons, navigation active states
- **Button Hover Blue** (`#3259E8`): Button hover and focus states
- **Neutral Gray** (`#A2ABB8`): Secondary interactive elements, disabled states

### Neutral Scale
- **Light Slate** (`#E2E8F0`): Most-used neutral background, card fills, form containers (166 uses)
- **White** (`#FFFFFF`): Primary content background, card surfaces (71 uses)
- **Off-White** (`#F8FAFC`): Subtle background variation, section backgrounds (15 uses)
- **Sky White** (`#F3F8FF`): Very light blue-tinted background for special regions
- **Soft Off-White** (`#F7F8FB`): Minimal background distinction
- **Cream** (`#FFFCEA`): Rare warm-toned background

### Surface & Borders
- **Light Gray Border** (`#E2E5EB`): Primary border stroke, divider lines
- **Transparent Black** (`#000000`): Rare dark overlay or text
- **Transparent** (`#0000`): Used for transparent/null states (38 occurrences)

### Semantic / Status
- **Warning** (`#FFB000`, `#FFBB00`): Alert states, caution messages, warning indicators
- **Error** (`#BE1F0B`, `#C32518`): Error states, destructive actions, failure feedback

## 3. Typography Rules

### Font Family
**Primary:** Plus Jakarta Sans (weights 400, 500, 600, with fallbacks to system sans-serif: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif`)

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display / Hero | Plus Jakarta Sans | 28px | 600 | 36px | -0.5px | Primary page headings, hero sections |
| Heading 1 | Plus Jakarta Sans | 24px | 600 | 32px | -0.3px | Section titles, major content blocks |
| Heading 2 | Plus Jakarta Sans | 16px | 600 | 24px | 0px | Subsection headings, card titles |
| Body Large | Plus Jakarta Sans | 16px | 400 | 24px | 0px | Primary body text, navigation labels |
| Body Regular | Plus Jakarta Sans | 14px | 400 | 20px | 0px | Standard paragraph text, UI labels |
| Button Label | Plus Jakarta Sans | 14px | 500 | 20px | 0px | Button text, CTA labels |
| Small / Caption | Plus Jakarta Sans | 12px | 600 | 16px | 0px | Captions, metadata, small UI text |
| Code / Monospace | Courier New | 12px | 400 | 16px | 0px | Code blocks, technical content |

### Principles
- **Hierarchy via weight:** Body text uses 400; section headings use 600 for clear distinction
- **Consistency across devices:** All sizes scaled in multiples of 4px for rhythm
- **Readability first:** Minimum 14px for body text, generous line heights (1.5× or more)
- **Professional tone:** Clean, modern typeface appropriate for B2B ticketing platform
- **Accessibility:** High contrast between text and background; sufficient line-height for scanning

## 4. Component Stylings

### Buttons

#### Primary Button
- **Background:** `#213FC0`
- **Text Color:** `#FFFFFF`
- **Font Size:** `14px`
- **Font Weight:** `500`
- **Line Height:** `20px`
- **Padding:** `8px 16px`
- **Border Radius:** `9999px` (fully rounded pill shape)
- **Height:** `36px`
- **Border:** `0px solid transparent`
- **Box Shadow:** `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`
- **Hover State:** Background transitions to `#3259E8`
- **Disabled State:** Opacity `0.5`, cursor not-allowed

#### Secondary Button
- **Background:** `#3259E8`
- **Text Color:** `#FFFFFF`
- **Font Size:** `14px`
- **Font Weight:** `500`
- **Line Height:** `20px`
- **Padding:** `8px 16px`
- **Border Radius:** `9999px`
- **Height:** `36px`
- **Border:** `0px solid transparent`
- **Box Shadow:** None
- **Hover State:** Background brightens to `#4A6CFF`
- **Active State:** Background darkens to `#213FC0`

#### Ghost Button
- **Background:** `transparent`
- **Text Color:** `#213FC0`
- **Font Size:** `14px`
- **Font Weight:** `500`
- **Line Height:** `20px`
- **Padding:** `8px 16px`
- **Border Radius:** `9999px`
- **Height:** `36px`
- **Border:** `1px solid #213FC0`
- **Box Shadow:** None
- **Hover State:** Background `rgba(33, 63, 192, 0.1)`, text remains `#213FC0`
- **Active State:** Background `rgba(33, 63, 192, 0.2)`

#### Large Button
- **Background:** `#213FC0`
- **Text Color:** `#FFFFFF`
- **Font Size:** `14px`
- **Font Weight:** `600`
- **Line Height:** `20px`
- **Padding:** `8px 16px`
- **Border Radius:** `9999px`
- **Height:** `40px`
- **Border:** `0px solid transparent`
- **Box Shadow:** None
- **Hover State:** Background transitions to `#3259E8`

### Cards & Containers

#### Default Card
- **Background:** `#FFFFFF`
- **Border:** `1px solid #E2E5EB`
- **Border Radius:** `8px`
- **Padding:** `24px`
- **Box Shadow:** `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`
- **Hover State:** Subtle elevation lift (increase shadow to `rgba(0, 0, 0, 0.08) 0px 2px 4px 0px`)

#### Light Background Container
- **Background:** `#F8FAFC`
- **Border:** `1px solid #E2E8F0`
- **Border Radius:** `8px`
- **Padding:** `20px`
- **Box Shadow:** None

#### Accent Background Container
- **Background:** `#C8DBFF`
- **Border:** `1px solid rgba(33, 63, 192, 0.2)`
- **Border Radius:** `8px`
- **Padding:** `16px`
- **Box Shadow:** None

### Inputs & Forms

#### Text Input (Default)
- **Background:** `#FFFFFF`
- **Text Color:** `#020817`
- **Border:** `1px solid #E2E8F0`
- **Border Radius:** `8px`
- **Padding:** `12px 16px`
- **Font Size:** `14px`
- **Font Weight:** `400`
- **Line Height:** `20px`
- **Min Height:** `40px`
- **Focus State:** Border color `#213FC0`, box shadow `0px 0px 0px 3px rgba(33, 63, 192, 0.1)`
- **Error State:** Border color `#BE1F0B`, box shadow `0px 0px 0px 3px rgba(190, 31, 11, 0.1)`

#### Input Label
- **Font Size:** `12px`
- **Font Weight:** `600`
- **Line Height:** `16px`
- **Color:** `#020817`
- **Margin Bottom:** `8px`

#### Placeholder Text
- **Color:** `#A2ABB8`
- **Font Style:** Italic
- **Font Size:** `14px`

### Navigation

#### Navigation Bar (Header)
- **Background:** `#213FC0` (navy blue gradient from `#152C8C` to `#213FC0`)
- **Height:** `56px`
- **Padding:** `0px 40px`
- **Text Color:** `#FFFFFF`
- **Font Size:** `16px`
- **Font Weight:** `400`
- **Line Height:** `24px`
- **Box Shadow:** `rgba(0, 0, 0, 0.1) 0px 2px 8px 0px`

#### Navigation Link
- **Color:** `#FFFFFF`
- **Font Size:** `14px`
- **Font Weight:** `400`
- **Line Height:** `20px`
- **Padding:** `12px 16px`
- **Border Radius:** `6px`
- **Hover State:** Background `rgba(255, 255, 255, 0.1)`
- **Active State:** Background `rgba(255, 255, 255, 0.2)`, font weight `500`

#### Dropdown Menu
- **Background:** `#FFFFFF`
- **Border:** `1px solid #E2E8F0`
- **Border Radius:** `8px`
- **Box Shadow:** `0px 4px 12px rgba(0, 0, 0, 0.15)`
- **Z-index:** `20`
- **Padding:** `8px`
- **Min Width:** `160px`

### Footer

#### Footer Container
- **Background:** `#152C8C`
- **Text Color:** `#FFFFFF`
- **Padding:** `64px 40px`
- **Border Top:** `1px solid rgba(255, 255, 255, 0.1)`

#### Footer Link
- **Color:** `#FFFFFF`
- **Font Size:** `14px`
- **Font Weight:** `400`
- **Line Height:** `20px`
- **Hover State:** Color `#C8DBFF`, text decoration underline

#### Footer Divider
- **Border:** `1px solid rgba(255, 255, 255, 0.2)`
- **Margin:** `32px 0px`

## 5. Layout Principles

### Spacing System

**Base Unit:** `4px` — all spacing values are multiples of 4px for consistent rhythm.

**Scale:**
- **Micro:** `4px` (tight spacing within components)
- **Extra Small:** `8px` (padding inside small elements, tight gaps)
- **Small:** `12px` (padding inside inputs, labels)
- **Base:** `16px` (standard padding, default margins)
- **Large:** `24px` (section padding, card padding)
- **Extra Large:** `32px` (gap between major sections)
- **XXL:** `40px` (outer container padding)
- **Mega:** `56px` (gap between layout sections)
- **Hero:** `64px` (large section padding, hero spacing)
- **Massive:** `80px` (top-level page padding)

**Usage Context:**
- `4px`: Inner button spacing, tight inline gaps
- `8px`: Component internal gaps, flex item spacing
- `12px`: Form field padding, list item spacing
- `16px`: Standard padding, default spacing around blocks
- `24px`: Card and container padding
- `32px`: Section gap spacing
- `40px`: Container padding, outer margins
- `56px`, `64px`: Hero section spacing, major visual breaks
- `80px`: Page-level top/bottom padding

### Grid & Container

- **Max Width:** `1440px` (primary content container)
- **Container Padding:** `40px` (sides) on desktop, `16px` on mobile
- **Grid Columns:** 4-column grid on mobile, 12-column on desktop
- **Column Strategy:** Auto-flow with equal spacing; use `gap: 20px` or `gap: 32px` depending on section
- **Section Pattern:** Full-width colored sections with centered max-width container inside
- **Card Grid:** 4-column card layout on desktop (each card `~ 300px` wide), 2-column on tablet, 1-column on mobile

### Whitespace Philosophy

Whitespace is generous and intentional, reflecting the premium nature of the platform. Large gaps between sections (32–64px) create visual breathing room and reduce cognitive load. Card-based layouts with consistent padding (`24px`) ensure content clarity. Margins between heading and body text follow a 1.5× ratio of padding. This approach prioritizes scannability and professional presentation over content density.

### Border Radius Scale

- **Fully Rounded (Pill):** `9999px` — buttons, badges, fully rounded elements
- **Large Radius:** `16px` — large container corners, emphasis elements
- **Standard Radius:** `8px` — cards, containers, inputs, modals
- **Small Radius:** `6px` — smaller interactive elements
- **No Radius:** `0px` — navigation bars, full-width sections

### Border Widths

- **Thin (Divider):** `1px` — borders, divider lines, subtle separators
- **Medium:** `2px` — not in use; reserved for future emphasis
- **Thick:** `3px` — not in use; reserved for focus states or special emphasis

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Base | No shadow | Flat surfaces, text, disabled states |
| Raised (sm) | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | Buttons, default cards, low emphasis |
| Elevated (md) | `rgba(0, 0, 0, 0.08) 0px 2px 4px 0px` | Card hover states, form focus |
| High (lg) | `rgba(0, 0, 0, 0.12) 0px 4px 12px 0px` | Dropdowns, modals, popovers |
| Maximum (xl) | `rgba(0, 0, 0, 0.15) 0px 8px 24px 0px` | Full-page modals, alerts, sticky overlays |

**Shadow Philosophy:** Shadows are minimal and refined, using low opacity black to suggest layering without overwhelming the clean aesthetic. Shadows increase in size (blur radius) as elevation increases, creating perceived depth. Most interactive elements use the "Raised (sm)" shadow for consistency with enterprise design standards.

### Opacity Levels

- **Full:** `1.0` (100%) — default state for all elements
- **Strong Disabled:** `0.67` (67%) — disabled form fields, inactive buttons
- **Hover Overlay:** `0.1` (10%) — subtle background overlay on hover
- **Focus Overlay:** `0.1` (10%) — focus state background tint
- **Disabled Overlay:** `0.5` (50%) — disabled interactive elements
- **Border/Divider:** `0.2` (20%) — subtle borders, divider lines

### Z-index / Layering

- **Base Layer:** `0` — default elements, body content
- **Relative Layers:** `1–10` — card hovers, shadow depth
- **Fixed Headers:** `15` — sticky navigation, permanent UI
- **Dropdown / Popover:** `20` — dropdown menus, popovers, tooltips
- **Modal / Overlay:** `40` — modal backgrounds, full-screen overlays
- **Toast / Notification:** `50` — toast messages, transient notifications
- **Absolute Top:** `9999` — critical alerts, emergency overlays (rare)

## 7. Do's and Don'ts

### Do

- **Use the full rounded pill style (`9999px`)** for all primary CTAs and buttons to maintain brand consistency
- **Maintain generous spacing** — use at least `24px` padding in cards and containers
- **Employ semantic colors** for status feedback: `#FFB000` for warnings, `#BE1F0B` for errors
- **Stack shadows progressively** as elevation increases; never combine multiple shadow styles on one element
- **Keep text in deep navy** (`#020817`) on light backgrounds for maximum contrast and readability
- **Use the neutral scale** (`#E2E8F0`, `#FFFFFF`, `#F8FAFC`) as primary backgrounds, reserving brand blues for interaction
- **Always test focus states** in keyboard navigation; ensure focus rings are visible at `3px` width
- **Group related spacing** — if you use `16px` margin, keep related elements to that same value
- **Leverage Plus Jakarta Sans** weights (400, 500, 600) to establish hierarchy without changing size
- **Center all major page sections** inside a max-width container with padding on sides

### Don't

- **Don't use rounded corners smaller than `6px`** on interactive elements
- **Don't combine more than two distinct shadows** on a single element
- **Don't use white text** (`#FFFFFF`) on any background lighter than `#213FC0`
- **Don't apply opacity to text directly**; instead, use a lighter color from the palette
- **Don't use the semantic warning/error colors** for any purpose other than their intended status (warnings, errors)
- **Don't set font-weight below 400** or above 600 for body/UI text
- **Don't apply padding less than `8px`** to clickable elements
- **Don't nest dropdowns more than one level deep**
- **Don't use fully transparent backgrounds** for interactive elements without a clear border
- **Don't exceed `1440px` max-width** for primary content sections
- **Don't skip focus states** — every interactive element must have a visible focus indicator
- **Don't mix Plus Jakarta Sans** with other sans-serif fonts in primary UI

## 8. Responsive Behavior

### Breakpoints

| Breakpoint Name | Width | Key Changes |
|-----------------|-------|-------------|
| Mobile | `320px–639px` | 1-column card grid, `16px` padding, smaller heading sizes (16px), stacked navigation, touch targets min `44px` |
| Tablet | `640px–1023px` | 2-column card grid, `24px` padding, medium heading sizes (20px), collapsible nav, `48px` touch targets |
| Desktop | `1024px–1439px` | 3–4-column card grid, `40px` padding, full heading sizes (24px), horizontal nav, `48px+` touch targets |
| Wide | `1440px+` | Capped at `1440px` max-width, centered container, full spacing scale |

### Touch Targets

- **Minimum:** `44px × 44px` — buttons, links, interactive elements on mobile (WCAG AAA standard)
- **Tablet / Desktop:** `48px × 48px` — slightly larger for comfort in hand-held and desktop contexts
- **Icon-only buttons:** `40px × 40px` minimum; use padding to achieve this
- **Spacing between targets:** Minimum `8px` gap to prevent accidental mis-taps

### Collapsing Strategy

- **Navigation:** Horizontal menu on desktop (≥1024px) → collapsible hamburger menu on mobile (<640px)
- **Cards:** 4-column grid (desktop) → 2-column (tablet) → 1-column (mobile)
- **Padding:** `40px` sides (desktop) → `24px` (tablet) → `16px` (mobile)
- **Heading Size:** 28px (desktop hero) → 24px (tablet) → 20px (mobile)
- **Buttons:** Full-width on mobile (<640px) below forms; side-by-side on tablet/desktop
- **Modals:** Full-screen on mobile with `8px` margin; centered with `300px–600px` width on desktop
- **Images:** 100% width with max aspect ratio on mobile; constrained width on desktop

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA:** Navy Blue (`#213FC0`)
- **Secondary CTA:** Vibrant Blue (`#3259E8`)
- **Main Background:** White (`#FFFFFF`)
- **Section Background:** Light Slate (`#E2E8F0`)
- **Heading Text:** Deep Navy (`#020817`)
- **Body Text:** Deep Navy (`#020817`)
- **Links (Footer):** White (`#FFFFFF`)
- **Warning State:** Warning Yellow (`#FFB000`)
- **Error State:** Error Red (`#BE1F0B`)
- **Border/Divider:** Light Gray (`#E2E5EB`)
- **Secondary Accent:** Light Blue (`#C8DBFF`)
- **Footer Background:** Deep Blue (`#152C8C`)
- **Disabled/Muted Text:** Neutral Gray (`#A2ABB8`)

### Iteration Guide

1. **Color application:** Always use `#213FC0` for primary buttons; reserve `#3259E8` for secondary actions and hover states. Never mix brand colors with semantic warning/error colors on the same component.

2. **Typography hierarchy:** Use 600 weight for headings, 500 for button labels, 400 for body text. Scale sizes in the table (16px → 14px → 12px) without deviation; maintain line-height at 1.5× font size minimum.

3. **Spacing consistency:** All padding/margin values must be multiples of `4px`. Use `24px` padding for cards, `16px` for form fields, `40px` for outer containers. Never guess spacing; reference the scale.

4. **Border radius:** Buttons use `9999px` (pill); cards/inputs use `8px`; smaller interactive elements use `6px`. Never use radius values not in the scale.

5. **Shadows:** Apply `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` to buttons and default cards only. Use heavier shadows (`rgba(0, 0, 0, 0.12) 0px 4px 12px 0px`) for dropdowns and modals. Never layer multiple shadows.

6. **Focus states:** Every interactive element must have a visible focus ring (`0px 0px 0px 3px rgba(33, 63, 192, 0.1)`). Test keyboard navigation on every interactive component.

7. **Responsive design:** At mobile (<640px), use 1-column layouts, `16px` padding, `44px` minimum touch targets. At tablet (640–1023px), use 2-column grids with `24px` padding. At desktop (≥1024px), use full spacing and multi-column layouts capped at `1440px` max-width.

8. **Component structure:** Buttons are fully rounded pills with `36px` or `40px` height and `8px 16px` padding. Inputs use `8px` border radius with `12px 16px` padding. Cards use `8px` radius with `24px` padding and light borders.

9. **Navigation & footer:** Header is `#213FC0` with white text at `56px` height. Footer is `#152C8C` with white text. All links in footer are `#FFFFFF` with no underline (underline on hover). Navigation dropdowns use `20` z-index and full white backgrounds.

10. **Status feedback:** Use `#FFB000` exclusively for warnings (4-corner alert), `#BE1F0B` exclusively for errors (red text, red borders). Apply `0.67` opacity to disabled states. Never show status colors mixed with brand blues on the same component.