# Natural Design System Documentation

## Overview
This design system provides a cohesive, natural aesthetic inspired by earth tones, forest greens, and organic forms. It emphasizes warmth, accessibility, and visual harmony.

## Color Palette

### Primary Colors - Forest Greens
- **Forest 50** (`#f8faf6`) - Morning mist
- **Forest 100** (`#f0f4ea`) - Pale sage
- **Forest 500** (`#6b8e47`) - Primary forest green
- **Forest 900** (`#2d3a20`) - Forest night

### Secondary Colors - Earth Tones
- **Earth 50** (`#fdfcfa`) - Warm cream
- **Earth 100** (`#f8f6f2`) - Light cream
- **Earth 500** (`#b5aa9a`) - Warm stone
- **Earth 900** (`#4a433b`) - Darkest taupe

### Accent Colors - Natural Teal
- **Nature 50** (`#f0faf8`) - Morning dew
- **Nature 500** (`#3ba88f`) - Primary teal
- **Nature 900** (`#1f4a3f`) - Teal night

### Warm Accents - Sunset Tones
- **Warm 50** (`#fef9f5`) - Warm white
- **Warm 500** (`#e39849`) - Golden amber
- **Warm 900** (`#74421d`) - Darkest amber

## Typography

### Font Families
- **Sans**: Inter Variable, Inter, system-ui
- **Serif**: Crimson Text, Georgia
- **Mono**: JetBrains Mono, Consolas
- **Display**: Inter Variable for large headings

### Font Sizes
- **xs**: 0.75rem (12px) - Micro text
- **sm**: 0.875rem (14px) - Small text
- **base**: 1rem (16px) - Body text
- **lg**: 1.125rem (18px) - Large body
- **xl**: 1.25rem (20px) - Small headings
- **2xl**: 1.5rem (24px) - Medium headings
- **3xl**: 1.875rem (30px) - Large headings

## Spacing Scale
Based on 4px grid with natural rhythm:
- **xs**: 0.25rem (4px) - Minimal
- **sm**: 0.5rem (8px) - Small
- **md**: 1rem (16px) - Base
- **lg**: 1.5rem (24px) - Spacious
- **xl**: 2rem (32px) - Generous
- **2xl**: 3rem (48px) - Airy

## Border Radius
Organic curves for natural feel:
- **xs**: 0.125rem (2px) - Subtle
- **sm**: 0.375rem (6px) - Gentle
- **default**: 0.5rem (8px) - Natural
- **md**: 0.75rem (12px) - Soft
- **lg**: 1rem (16px) - Rounded
- **xl**: 1.25rem (20px) - Curved

## Shadows
Natural depth with warm undertones:
- **xs**: Subtle shadow for minimal elevation
- **sm**: Light shadow for cards
- **md**: Standard shadow for elevated elements
- **lg**: Prominent shadow for modals
- **xl**: Deep shadow for floating elements

## Component Guidelines

### Buttons
- Use `btn-natural-primary` for primary actions
- Use `btn-natural-secondary` for secondary actions
- Use `btn-natural-outline` for tertiary actions
- Always include hover states with subtle lift

### Cards
- Use `card-natural` for standard cards
- Use `card-natural-elevated` for important content
- Include hover effects for interactive cards

### Forms
- Use `input-natural` for form inputs
- Use `form-natural` for form containers
- Include focus states with natural ring colors

### Typography
- Use semantic text classes: `text-natural-primary`, `text-natural-muted`
- Maintain proper hierarchy with size classes
- Use appropriate line heights for readability

## Usage Examples

### Basic Card
```html
<div class="card-natural p-6">
  <h3 class="text-natural-xl font-semibold mb-4">Card Title</h3>
  <p class="text-natural-muted">Card content goes here.</p>
</div>
```

### Primary Button
```html
<button class="btn-natural-primary">
  Click Me
</button>
```

### Form Input
```html
<div class="form-group-natural">
  <label class="label-natural">Email</label>
  <input type="email" class="input-natural" placeholder="Enter your email">
</div>
```

## Accessibility
- All colors meet WCAG AA contrast requirements
- Focus states are clearly visible
- Interactive elements have appropriate sizing
- Semantic HTML structure is maintained

## Best Practices
1. Use the design system consistently across all components
2. Prefer utility classes over custom CSS when possible
3. Maintain the natural, organic feel in all designs
4. Test color combinations for accessibility
5. Use appropriate spacing for visual hierarchy