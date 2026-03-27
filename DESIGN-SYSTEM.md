---
name: edge-design-system
description: |
  The Edge Design System — a comprehensive shadcn/ui-based design system with custom "Bono" branding. Use this skill whenever creating UI components, HTML pages, React components, presentations, mockups, or any visual output for the user's project. This includes: building dashboards, landing pages, forms, cards, modals, tables, charts, navigation, or any web interface. Trigger whenever the user mentions "design system", "component", "UI", "interface", "layout", "page", "dashboard", "form", or asks to create anything visual or front-end related. Also trigger when the user asks to generate HTML, React/JSX, or Tailwind CSS code. MANDATORY: Always use this skill's color palette, typography, spacing, and component guidelines to ensure brand consistency.
---

# The Edge Design System

A comprehensive design system built on **shadcn/ui** and **TailwindCSS**, featuring a custom "Bono" brand identity with a signature pink-to-fuchsia gradient primary color.

**Source**: Figma — "The Edge Design System" by shadcndesign.com
**Framework**: shadcn/ui + TailwindCSS
**Modes**: Light & Dark

---

## Brand Identity

The design system's signature element is the **Bono gradient** — a vivid pink-to-fuchsia gradient used for primary actions and accent elements. This gradient creates a modern, energetic feel while maintaining professional readability.

---

## Color Tokens

### Light Mode (`:root`)

| Token                    | Value       | Usage                                      |
|--------------------------|-------------|---------------------------------------------|
| `--background`           | `#F8FAFC`   | Page background (Slate-50)                  |
| `--foreground`           | `#0F172A`   | Primary text (Slate-900)                    |
| `--card`                 | `#FFFFFF`   | Card backgrounds                            |
| `--card-foreground`      | `#0F172A`   | Card text                                   |
| `--popover`              | `#FFFFFF`   | Popover backgrounds                         |
| `--popover-foreground`   | `#0F172A`   | Popover text                                |
| `--primary`              | `#18181B`   | Primary button background (dark)            |
| `--primary-foreground`   | `#FAFAFA`   | Primary button text (light)                 |
| `--secondary`            | `#F1F5F9`   | Secondary backgrounds                       |
| `--secondary-foreground` | `#0F172A`   | Secondary text                              |
| `--muted`                | `#F1F5F9`   | Muted/subtle backgrounds                    |
| `--muted-foreground`     | `#64748B`   | Muted text (Slate-500)                      |
| `--accent`               | `#F1F5F9`   | Accent backgrounds                          |
| `--accent-foreground`    | `#0F172A`   | Accent text                                 |
| `--destructive`          | `#EF4444`   | Error/destructive actions (Red-500)         |
| `--destructive-foreground`| `#FAFAFA`  | Destructive action text                     |
| `--border`               | `#E2E8F0`   | Default borders (Slate-200)                 |
| `--input`                | `#E2E8F0`   | Input borders                               |
| `--ring`                 | `#18181B`   | Focus ring color                            |

### Dark Mode (`.dark`)

| Token                    | Value       | Usage                                      |
|--------------------------|-------------|---------------------------------------------|
| `--background`           | `#09090B`   | Page background (Zinc-950)                  |
| `--foreground`           | `#FAFAFA`   | Primary text                                |
| `--card`                 | `#18181B`   | Card backgrounds (Zinc-900)                 |
| `--card-foreground`      | `#FAFAFA`   | Card text                                   |
| `--popover`              | `#18181B`   | Popover backgrounds                         |
| `--popover-foreground`   | `#FAFAFA`   | Popover text                                |
| `--primary`              | `#FAFAFA`   | Primary button background                   |
| `--primary-foreground`   | `#18181B`   | Primary button text                         |
| `--secondary`            | `#27272A`   | Secondary backgrounds (Zinc-800)            |
| `--secondary-foreground` | `#FAFAFA`   | Secondary text                              |
| `--muted`                | `#27272A`   | Muted backgrounds                           |
| `--muted-foreground`     | `#A1A1AA`   | Muted text (Zinc-400)                       |
| `--accent`               | `#27272A`   | Accent backgrounds                          |
| `--accent-foreground`    | `#FAFAFA`   | Accent text                                 |
| `--destructive`          | `#DC2626`   | Destructive actions (Red-600)               |
| `--destructive-foreground`| `#FAFAFA`  | Destructive text                            |
| `--border`               | `#27272A`   | Borders (Zinc-800)                          |
| `--input`                | `#27272A`   | Input borders                               |
| `--ring`                 | `#D4D4D8`   | Focus ring (Zinc-300)                       |

### Brand Gradient (Primary CTA)

The signature "Bono gradient" is used for primary call-to-action buttons and hero elements:

```css
.btn-primary-gradient {
  background: linear-gradient(135deg, #EC4899, #EE4379, #86198F);
}
```

| Stop       | Color     | Name           |
|------------|-----------|----------------|
| Start      | `#EC4899` | Pink-500       |
| Middle     | `#EE4379` | Bono-500       |
| End        | `#86198F` | Fuchsia-800    |

Use the gradient for: primary CTA buttons, hero sections, active/highlighted chart elements, calendar highlights, progress indicators, and key accent areas.

### Additional Colors

| Token                     | Value     | Usage                    |
|---------------------------|-----------|--------------------------|
| `--warning`               | `#F59E0B` | Warning states           |
| `--warning-foreground`    | `#451A03` | Warning text             |
| `--chart-1` (pink accent) | `#EC4899` | Chart primary color      |
| `--alpha-60`              | `rgba(255,255,255,0.4)` | Overlay/glass effect |

---

## Typography

### Font Family

**Primary font**: `Inter` (sans-serif)
CSS variable: `font/font-sans`

```css
--font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
```

### Type Scale (TailwindCSS)

| Class         | Size   | Line Height | Usage                              |
|---------------|--------|-------------|------------------------------------|
| `text-xs`     | 12px   | 16px        | Badges, labels, captions           |
| `text-sm`     | 14px   | 20px        | Secondary text, form labels        |
| `text-base`   | 16px   | 24px        | Body text, buttons                 |
| `text-lg`     | 18px   | 28px        | Card titles, subheadings           |
| `text-xl`     | 20px   | 28px        | Section headings                   |
| `text-2xl`    | 24px   | 32px        | Page subtitles                     |
| `text-3xl`    | 30px   | 36px        | Page titles                        |
| `text-4xl`    | 36px   | 40px        | Hero headings                      |

### Font Weights

| Weight     | Value | Usage                           |
|------------|-------|---------------------------------|
| `normal`   | 400   | Body text                       |
| `medium`   | 500   | Buttons, labels, nav items      |
| `semibold` | 600   | Card titles, subheadings        |
| `bold`     | 700   | Page titles, hero text          |

---

## Spacing

The system uses a **4px base unit** spacing scale consistent with TailwindCSS:

| Token         | Value  | Usage                                    |
|---------------|--------|------------------------------------------|
| `spacing/1`   | 4px    | Tight gaps (icon-to-text)                |
| `spacing/2`   | 8px    | Button padding (vertical), small gaps    |
| `spacing/3`   | 12px   | Form element padding                     |
| `spacing/4`   | 16px   | Default gap between elements             |
| `spacing/6`   | 24px   | Card padding, section gaps               |
| `spacing/8`   | 32px   | Section padding                          |
| `spacing/10`  | 40px   | Button padding (horizontal)              |
| `spacing/16`  | 64px   | Major section gaps                       |
| `spacing/32`  | 128px  | Page-level top/bottom padding            |

---

## Border Radius

| Token       | Value  | Usage                                                    |
|-------------|--------|----------------------------------------------------------|
| `radius-sm` | 4px    | Tags, chips, small badges — subtle rounding              |
| `radius-md` | 6px    | Buttons, inputs, cards — the default for most UI         |
| `radius-lg` | 8px    | Modals, larger cards, feature sections                   |
| `radius-xl` | 12px   | Floating panels, prominent elements, rounded aesthetic   |

```css
--radius: 0.5rem; /* Base radius = radius-md */
```

---

## Layout

| Property     | Value     | Notes                        |
|--------------|-----------|------------------------------|
| Max width    | 1536px    | Content container            |
| Grid columns | 11        | Base grid                    |
| Grid gap     | 16px      | Column and row gap           |
| Padding      | 16px      | Container horizontal padding |

---

## Shadows

| Level     | Value                                           | Usage                    |
|-----------|-------------------------------------------------|--------------------------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)`                | Cards, subtle elevation  |
| `shadow`    | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Dropdowns, popovers |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Modals, sheets   |

---

## Components

All components follow shadcn/ui patterns. Here is the complete component library:

### Form & Input
- **Button** — Primary (gradient or solid), Secondary (outline), Destructive, Ghost, Link variants. Sizes: sm, default, lg, icon.
- **Input** — Text inputs with label, placeholder, and validation states
- **Textarea** — Multi-line text input
- **Select** — Dropdown selection
- **Checkbox** — Single or grouped checkboxes
- **Radio Group** — Radio button groups
- **Switch** — Toggle switches (needs extra size variant)
- **Combobox** — Searchable dropdown
- **Date Picker** — Date selection with calendar popup
- **Input OTP** — One-time password input fields
- **Slider** — Range slider

### Data Display
- **Card** — Container with header, content, footer. Border: 1px, padding: spacing/6
- **Table** — Data tables with sorting, filtering
- **Data Table** — Advanced data table with pagination
- **Badge** — Status indicators, labels
- **Avatar** — User profile images with fallback
- **Calendar** — Month view calendar with highlighted dates
- **Skeleton** — Loading placeholder
- **Separator** — Visual divider

### Navigation
- **Navigation Menu** — Main navigation bar
- **Breadcrumb** — Path/breadcrumb navigation
- **Tabs** — Tab-based navigation
- **Pagination** — Page navigation
- **Dropdown Menu** — Context menus

### Feedback & Overlay
- **Dialog** — Modal dialogs
- **Drawer** — Slide-in panels
- **Sheet** — Side sheets
- **Popover** — Contextual popups
- **Tooltip** — Hover hints
- **Alert** — Information/warning banners
- **Sonner / Notification** — Toast notifications
- **Progress** — Progress bars

### Layout
- **Accordion** — Collapsible sections
- **Carousel** — Image/content carousel
- **Toggle** — Toggle buttons
- **Toggle Group** — Grouped toggle buttons
- **Command** — Command palette (⌘K)

---

## Implementation Guidelines

### When generating HTML artifacts:

1. Always use the Inter font via Google Fonts:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
   ```

2. Apply CSS variables for theming:
   ```css
   :root {
     --background: #F8FAFC;
     --foreground: #0F172A;
     --card: #FFFFFF;
     --card-foreground: #0F172A;
     --primary: #18181B;
     --primary-foreground: #FAFAFA;
     --secondary: #F1F5F9;
     --muted: #F1F5F9;
     --muted-foreground: #64748B;
     --border: #E2E8F0;
     --input: #E2E8F0;
     --ring: #18181B;
     --destructive: #EF4444;
     --warning: #F59E0B;
     --radius: 0.5rem;
     --font-sans: 'Inter', sans-serif;
   }
   ```

3. Use the Bono gradient for primary CTAs:
   ```css
   .btn-primary {
     background: linear-gradient(135deg, #EC4899, #EE4379, #86198F);
     color: #FFFFFF;
     font-weight: 500;
     padding: 8px 40px;
     border-radius: var(--radius);
   }
   ```

### When generating React/JSX artifacts:

1. Use Tailwind utility classes following the design tokens
2. Import from shadcn/ui component library when available
3. Apply the Bono gradient via inline styles or custom classes
4. Respect the spacing scale (multiples of 4px)
5. Use `rounded-md` as default border radius

### Button Styles Reference:

```css
/* Primary CTA (gradient) */
.btn-gradient { background: linear-gradient(135deg, #EC4899, #EE4379, #86198F); color: white; }

/* Primary (solid) */
.btn-primary { background: #18181B; color: #FAFAFA; }

/* Secondary */
.btn-secondary { background: #F1F5F9; color: #0F172A; }

/* Destructive */
.btn-destructive { background: #EF4444; color: #FAFAFA; }

/* Outline */
.btn-outline { border: 1px solid #E2E8F0; background: transparent; color: #0F172A; }

/* Ghost */
.btn-ghost { background: transparent; color: #0F172A; }

/* All buttons: h-10 (40px), px-10 (40px), py-2 (8px), rounded-md, font-medium, text-base */
```

### Dark Mode:

When the user requests dark mode, swap to the dark color tokens. The page background becomes `#09090B`, cards become `#18181B`, and borders become `#27272A`. The Bono gradient remains the same across both modes — it provides consistent brand identity.

---

## Quick Reference: CSS Variables Block

Copy-paste ready for `globals.css`:

```css
@layer base {
  :root {
    --background: 210 40% 98%;
    --foreground: 222 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;
    --primary: 240 6% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222 47% 11%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;
    --accent: 210 40% 96%;
    --accent-foreground: 222 47% 11%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 240 6% 10%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 240 6% 4%;
    --foreground: 0 0% 98%;
    --card: 240 6% 10%;
    --card-foreground: 0 0% 98%;
    --popover: 240 6% 10%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 6% 10%;
    --secondary: 240 4% 16%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 4% 16%;
    --muted-foreground: 240 5% 65%;
    --accent: 240 4% 16%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 63% 31%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 4% 16%;
    --input: 240 4% 16%;
    --ring: 240 5% 84%;
  }
}
```
