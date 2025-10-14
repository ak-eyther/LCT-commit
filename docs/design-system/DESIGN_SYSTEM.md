# LCT Design System

**Version:** 1.0.0
**Last Updated:** 2025-01-12
**Theme:** Warm Minimal (Terracotta)
**Status:** Approved & Active

---

## 🎯 Purpose

This document is the **single source of truth** for design decisions across the LCT-Vitraya healthcare claims tracking system. All agents (Cursor, Claude Code, and future AI assistants) MUST reference this document when:

- Creating new UI components
- Modifying existing designs
- Reviewing code for design consistency
- Making style decisions

---

## 🎨 Design Philosophy

### Core Principles

1. **Minimal & Clean** - Remove unnecessary elements, embrace whitespace
2. **Professional** - Healthcare-appropriate, trustworthy appearance
3. **Approachable** - Warm tones, readable typography
4. **Efficient** - Compact UI inspired by X.com
5. **Accessible** - WCAG 2.2 AA compliant (minimum)

### Design Inspiration

- **Warm tones:** Anthropic/Claude's terracotta accent
- **Compact UI:** X.com (Twitter) button sizing
- **Minimalism:** Grok's black & white focus
- **NO purple, minimal blue:** Professional tech company aesthetic

---

## 🎨 Color System

### Primary Colors

```css
/* Warm Minimal Theme */
--primary: #0a0a0a; /* Near-black primary */
--accent: #d97757; /* Terracotta accent (NO PURPLE!) */
--background: #ffffff; /* Pure white background */
--surface: #ffffff; /* Card/panel surface */
--text: #0a0a0a; /* Primary text color */
--text-secondary: #525252; /* Secondary text */
```

### Neutral Colors

```css
--border: #e5e5e5; /* Default borders */
--muted: #f5f5f5; /* Muted backgrounds */
--muted-fg: #737373; /* Muted foreground */
```

### Semantic Colors

```css
--success: #16a34a; /* Green - completed, approved */
--warning: #f59e0b; /* Amber - warnings, planned */
--error: #dc2626; /* Red - errors, critical */
--info: #737373; /* Gray - info (NO BLUE!) */
```

### Color Usage Rules

**✅ DO:**

- Use `--accent` (#d97757) for interactive elements (hover states, active tabs, progress)
- Use semantic colors (`--success`, `--warning`, `--error`) for their intended purpose only
- Use `--info` (gray) instead of blue for informational elements
- Maintain contrast ratios of 4.5:1 minimum for text

**❌ DON'T:**

- Use purple (#9333ea or any purple) anywhere
- Use blue (#0066FF or any blue) except in legacy contexts being migrated
- Use accent color for text (low contrast)
- Create custom colors without adding them to this document

### Color Palette Reference

| Color Name | Hex Code | RGB                | Usage                                |
| ---------- | -------- | ------------------ | ------------------------------------ |
| Primary    | #0a0a0a  | rgb(10, 10, 10)    | Primary text, buttons                |
| Accent     | #d97757  | rgb(217, 119, 87)  | Hover states, active items, progress |
| Success    | #16a34a  | rgb(22, 163, 74)   | Completed items, approvals           |
| Warning    | #f59e0b  | rgb(245, 158, 11)  | Warnings, planned items              |
| Error      | #dc2626  | rgb(220, 38, 38)   | Errors, critical priority            |
| Info       | #737373  | rgb(115, 115, 115) | Informational (NO BLUE)              |

---

## 📝 Typography

### Font Families

```css
--font-sans:
  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
  Arial, sans-serif;
--font-mono: 'SF Mono', Consolas, Monaco, 'Courier New', monospace;
```

**Always use system fonts** - no custom font loading for performance.

### Type Scale

```css
--text-xs: 0.75rem; /* 12px - Small labels, captions */
--text-sm: 0.8125rem; /* 13px - Compact UI elements */
--text-base: 0.875rem; /* 14px - Body text */
--text-lg: 1rem; /* 16px - Card titles */
--text-xl: 1.125rem; /* 18px - Section headings */
--text-2xl: 1.25rem; /* 20px - Page titles */
--text-3xl: 1.5rem; /* 24px - Dashboard headers */
--text-4xl: 2rem; /* 32px - Display text */
```

### Font Weights

```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights

```css
--leading-tight: 1.25; /* Headings */
--leading-normal: 1.5; /* Body text */
--leading-relaxed: 1.75; /* Long-form content */
```

### Typography Usage Matrix

| Element         | Size             | Weight  | Line Height | Example                     |
| --------------- | ---------------- | ------- | ----------- | --------------------------- |
| Display heading | 32px (text-4xl)  | 600     | 1.25        | "Healthcare Claims Tracker" |
| Page title      | 24px (text-3xl)  | 600     | 1.25        | "Success Matrix Dashboard"  |
| Section heading | 20px (text-2xl)  | 600     | 1.25        | "Fraud Detection Criteria"  |
| Card title      | 16px (text-lg)   | 600     | 1.5         | "Invoice Validation"        |
| Body text       | 14px (text-base) | 400     | 1.5         | Descriptions, explanations  |
| Small text      | 13px (text-sm)   | 400/500 | 1.5         | Button labels, compact UI   |
| Caption         | 12px (text-xs)   | 400     | 1.5         | Help text, labels           |

---

## 📏 Spacing System

### Base Unit: 4px

All spacing MUST use multiples of 4px for consistency.

```css
--spacing-0: 0;
--spacing-1: 0.25rem; /* 4px */
--spacing-2: 0.5rem; /* 8px */
--spacing-3: 0.75rem; /* 12px */
--spacing-4: 1rem; /* 16px */
--spacing-5: 1.25rem; /* 20px */
--spacing-6: 1.5rem; /* 24px */
--spacing-8: 2rem; /* 32px */
--spacing-10: 2.5rem; /* 40px */
--spacing-12: 3rem; /* 48px */
--spacing-16: 4rem; /* 64px */
--spacing-20: 5rem; /* 80px */
```

### Spacing Usage Guide

| Use Case          | Spacing Value | Example                         |
| ----------------- | ------------- | ------------------------------- |
| Compact gaps      | 4px-8px       | Button icon gaps, inline badges |
| Component padding | 12px-16px     | Card padding, button padding    |
| Section spacing   | 20px-32px     | Between sections, page margins  |
| Large gutters     | 40px-64px     | Page-level spacing              |

**✅ DO:** Use spacing variables (e.g., `padding: var(--spacing-3)`)
**❌ DON'T:** Use arbitrary values (e.g., `padding: 14px`)

---

## 🔘 Buttons

### Button Sizes

**Default (Compact)** - Inspired by X.com

```css
padding: 6px 12px;
font-size: 13px;
font-weight: 500;
border-radius: 6px;
```

**Small**

```css
padding: 4px 8px;
font-size: 12px;
```

**Large**

```css
padding: 8px 16px;
font-size: 14px;
```

### Button Variants

#### Primary Button

```css
background: var(--primary); /* #0a0a0a */
color: #ffffff;
border: 1px solid var(--primary);

:hover {
  opacity: 0.9;
}
```

#### Secondary Button

```css
background: var(--surface); /* #ffffff */
color: var(--text);
border: 1px solid var(--border);

:hover {
  background: var(--muted); /* #f5f5f5 */
}
```

#### Accent Button (Use Sparingly)

```css
background: var(--accent); /* #d97757 */
color: #ffffff;
border: 1px solid var(--accent);

:hover {
  opacity: 0.9;
}
```

#### Ghost Button

```css
background: transparent;
color: var(--text);
border: 1px solid transparent;

:hover {
  background: var(--muted);
}
```

#### Destructive Button

```css
background: var(--error); /* #dc2626 */
color: #ffffff;
border: 1px solid var(--error);

:hover {
  opacity: 0.9;
}
```

### Button States

```css
/* Focus state */
:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(217, 119, 87, 0.1);
}

/* Disabled state */
:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loading state */
.loading {
  opacity: 0.7;
  pointer-events: none;
}
```

---

## 🎴 Cards

### Standard Card

```css
background: var(--surface);
border: 1px solid var(--border);
border-radius: 8px;
padding: 20px;

/* Optional hover effect */
:hover {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

### Stats Card

```css
background: var(--surface);
border: 1px solid var(--border);
border-radius: 8px;
padding: 20px;
text-align: center;

/* Accent variant */
&.accent {
  border-left: 3px solid var(--accent);
}

/* Success variant */
&.success {
  background: #f0fdf4;
  border-color: #bbf7d0;
  border-left: 3px solid var(--success);
}
```

### Card Spacing

- **Card padding:** 20px (--spacing-5)
- **Card gap:** 16px (--spacing-4)
- **Inner spacing:** 12px (--spacing-3)

---

## 🏷️ Badges

### Badge Sizes

```css
/* Default */
padding: 3px 10px;
font-size: 12px;
font-weight: 500;
border-radius: 6px;
border: 1px solid;

/* Small */
padding: 2px 8px;
font-size: 11px;
```

### Badge Variants

#### Critical Priority

```css
background: #fef2f2;
color: #991b1b;
border-color: #fecaca;
```

#### High Priority

```css
background: #fef3c7;
color: #92400e;
border-color: #fde68a;
```

#### Medium Priority

```css
background: #dbeafe;
color: #1e40af;
border-color: #bfdbfe;
```

#### Low Priority

```css
background: var(--muted);
color: var(--text-secondary);
border-color: var(--border);
```

#### Accent Badge

```css
background: rgba(217, 119, 87, 0.1);
color: var(--accent);
border-color: rgba(217, 119, 87, 0.3);
```

**⚠️ IMPORTANT:** Never use purple badges. Old purple percentage badges MUST be replaced with accent badges.

---

## 📥 Form Elements

### Input Fields

```css
width: 100%;
padding: 8px 12px;
border: 1px solid var(--border);
border-radius: 6px;
font-size: 14px;
background: var(--surface);
color: var(--text);

:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(217, 119, 87, 0.1);
}

:disabled {
  background: var(--muted);
  cursor: not-allowed;
  opacity: 0.6;
}
```

### Select Dropdowns

Same styling as input fields.

### Textareas

```css
/* Same as input, plus: */
resize: vertical;
min-height: 60px;
```

### Labels

```css
display: block;
font-size: 13px;
font-weight: 500;
color: var(--text);
margin-bottom: 6px;
```

---

## 🧭 Navigation

### Tab Navigation

```css
.nav-item {
  padding: 8px 12px;
  border: none;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  border-bottom: 2px solid transparent;
  transition: all 0.15s;

  :hover {
    color: var(--text);
  }

  &.active {
    color: var(--text);
    border-bottom-color: var(--accent);
  }
}
```

### Top Navigation Bar

```css
background: var(--surface);
border-bottom: 1px solid var(--border);
padding: 16px 24px;
```

---

## 📊 Data Visualization

### Progress Bars

```css
.progress-bar {
  height: 8px;
  background: var(--muted);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--success); /* Green for completion */
  transition: width 0.3s ease;
}
```

### Stats Display

```css
.stat-number {
  font-size: 36px;
  font-weight: 700;
  color: var(--text);
}

.stat-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
}
```

---

## 🎭 Effects & Transitions

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 4px 6px rgba(0, 0, 0, 0.1);
```

**Usage:** Use sparingly. Only on hover states or modals.

### Border Radius

```css
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-full: 9999px;
```

### Transitions

```css
--transition-fast: 0.15s ease;
--transition-base: 0.2s ease;
--transition-slow: 0.3s ease;
```

**Default for interactive elements:** `transition: all 0.15s ease;`

---

## ♿ Accessibility

### Minimum Requirements (WCAG 2.2 AA)

1. **Color Contrast:**
   - Normal text: 4.5:1 minimum
   - Large text (18px+): 3:1 minimum
   - UI components: 3:1 minimum

2. **Focus States:**
   - All interactive elements MUST have visible focus states
   - Use `box-shadow` for focus rings (never just `outline`)

3. **Keyboard Navigation:**
   - All functionality accessible via keyboard
   - Logical tab order

4. **Labels:**
   - All form inputs MUST have associated labels
   - Use `aria-label` for icon-only buttons

5. **Alt Text:**
   - All images MUST have alt text
   - Decorative images: `alt=""`

### Color Accessibility Matrix

| Combination                       | Contrast Ratio | Pass/Fail          |
| --------------------------------- | -------------- | ------------------ |
| Text (#0a0a0a) on White (#ffffff) | 19.6:1         | ✅ AAA             |
| Accent (#d97757) on White         | 3.2:1          | ⚠️ Large text only |
| Success (#16a34a) on White        | 3.4:1          | ⚠️ Large text only |
| Text Secondary (#525252) on White | 7.5:1          | ✅ AAA             |

**Rule:** Never use accent color for body text. Only for large text (18px+) or backgrounds with white text.

---

## 📱 Responsive Design

### Breakpoints

```css
--breakpoint-sm: 640px; /* Mobile */
--breakpoint-md: 768px; /* Tablet */
--breakpoint-lg: 1024px; /* Desktop */
--breakpoint-xl: 1280px; /* Large desktop */
```

### Mobile-First Approach

Always design for mobile first, then scale up.

```css
/* Mobile (default) */
.grid {
  grid-template-columns: 1fr;
}

/* Tablet and up */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 🚨 Migration Rules

### From Old Design → New Design

1. **Replace Purple:**

   ```css
   /* OLD */
   color: #9333ea;

   /* NEW */
   color: var(--accent); /* #d97757 */
   ```

2. **Replace Blue (Info):**

   ```css
   /* OLD */
   color: #2563eb;

   /* NEW */
   color: var(--info); /* #737373 gray */
   ```

3. **Update Button Sizes:**

   ```css
   /* OLD */
   padding: 8px 16px;
   font-size: 14px;

   /* NEW */
   padding: 6px 12px;
   font-size: 13px;
   ```

4. **Standardize Spacing:**

   ```css
   /* OLD */
   margin: 14px;
   padding: 20px 15px;

   /* NEW */
   margin: var(--spacing-3); /* 12px */
   padding: var(--spacing-5) var(--spacing-4); /* 20px 16px */
   ```

---

## 📋 Component Checklist

Before creating ANY new component, verify:

- [ ] Uses CSS variables (not hardcoded colors)
- [ ] No purple (#9333ea) anywhere
- [ ] Minimal blue usage (only semantic, not decorative)
- [ ] Buttons use compact sizing (6px 12px)
- [ ] Spacing uses 4px multiples
- [ ] Focus states are visible
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Responsive on mobile
- [ ] Keyboard accessible

---

## 🤖 Agent Instructions

### For Cursor AI

When working in this codebase:

1. Always reference `docs/design-system/DESIGN_SYSTEM.md` before styling
2. Use the CSS variables from `src/assets/css/design-tokens.css`
3. Never introduce purple or blue colors
4. Follow the Warm Minimal theme specifications

### For Claude Code

When creating UI components:

1. Read this document for design tokens
2. Apply Warm Minimal theme (terracotta accent)
3. Use compact button sizing (6px 12px)
4. Maintain 4px spacing grid

### For All AI Agents

**MUST DO:**

- Read this file before any UI work
- Use CSS variables (never hardcode colors)
- Follow spacing system (4px multiples)
- Maintain accessibility standards

**NEVER DO:**

- Use purple (#9333ea or any purple)
- Use blue decoratively (only for semantics if absolutely necessary)
- Create custom spacing values
- Ignore accessibility requirements

---

## 📚 Quick Reference

### Most Common Patterns

**Button:**

```html
<button class="btn btn-primary">Save</button>
```

**Card:**

```html
<div class="card">
  <h3 class="card-title">Title</h3>
  <p class="card-content">Content</p>
</div>
```

**Badge:**

```html
<span class="badge badge-critical">CRITICAL</span>
```

**Input:**

```html
<label class="form-label">Name</label> <input type="text" class="form-input" />
```

---

## 🔄 Versioning

- **1.0.0** - Initial Warm Minimal theme (2025-01-12)
- Future changes require version bump and PR approval

---

## 📞 Support

Questions about design decisions:

- Review this document first
- Check `design-preview/design-system-preview.html` for live examples
- Ask in PR comments if unclear

---

**This is a living document. All changes MUST go through PR review.**

**Last reviewed:** 2025-01-12
**Approved by:** User (Warm Minimal selected)
**Effective:** Immediately
