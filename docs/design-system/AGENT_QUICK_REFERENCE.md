# Agent Quick Reference - LCT Design System

**For:** All AI Agents (Cursor, Claude Code, etc.)
**Purpose:** Fast lookup of design tokens when coding

---

## 🚀 Before You Start

**READ FIRST:** `docs/design-system/DESIGN_SYSTEM.md`

This is a quick reference only. Full specifications are in the main document.

---

## ⚡ Quick Rules

1. **NO PURPLE** - Use `--accent` (#d97757) instead
2. **MINIMAL BLUE** - Use `--info` (#737373 gray) instead
3. **Compact buttons** - `padding: 6px 12px`
4. **4px spacing** - Use multiples only
5. **CSS variables** - Never hardcode colors

---

## 🎨 Color Tokens

```css
/* Copy these when coding */
var(--primary)          /* #0a0a0a - Near-black */
var(--accent)           /* #d97757 - Terracotta */
var(--text)             /* #0a0a0a - Text */
var(--text-secondary)   /* #525252 - Muted text */
var(--border)           /* #e5e5e5 - Borders */
var(--muted)            /* #f5f5f5 - Backgrounds */
var(--success)          /* #16a34a - Green */
var(--warning)          /* #f59e0b - Amber */
var(--error)            /* #dc2626 - Red */
var(--info)             /* #737373 - Gray NOT BLUE */
```

---

## 📏 Spacing

```css
var(--spacing-2)   /* 8px  - Compact gaps */
var(--spacing-3)   /* 12px - Button padding */
var(--spacing-4)   /* 16px - Card padding */
var(--spacing-5)   /* 20px - Section spacing */
var(--spacing-6)   /* 24px - Larger spacing */
var(--spacing-8)   /* 32px - Page spacing */
```

---

## 🔘 Button Template

```html
<button class="btn btn-primary">Label</button>
```

```css
.btn {
  padding: 6px 12px; /* Compact! */
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  border: 1px solid;
}
```

---

## 🎴 Card Template

```html
<div class="card">
  <h3 class="card-title">Title</h3>
  <p class="card-content">Content</p>
</div>
```

```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px;
}
```

---

## 🏷️ Badge Template

```html
<span class="badge badge-critical">CRITICAL</span>
```

```css
.badge {
  padding: 3px 10px;
  font-size: 12px;
  border-radius: 6px;
  border: 1px solid;
}
```

---

## 📥 Input Template

```html
<label class="form-label">Field Name</label>
<input type="text" class="form-input" />
```

```css
.form-input {
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 14px;
}

.form-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(217, 119, 87, 0.1);
}
```

---

## 🔄 Migration Cheat Sheet

| Old Code            | New Code                   |
| ------------------- | -------------------------- |
| `color: #9333ea`    | `color: var(--accent)`     |
| `color: #2563eb`    | `color: var(--info)`       |
| `padding: 8px 16px` | `padding: 6px 12px`        |
| `font-size: 14px`   | `font-size: 13px`          |
| `margin: 15px`      | `margin: var(--spacing-4)` |

---

## ✅ Checklist (Copy-Paste for PRs)

```markdown
Design System Compliance:

- [ ] Uses CSS variables (no hardcoded colors)
- [ ] No purple (#9333ea) anywhere
- [ ] Minimal blue (only gray for info)
- [ ] Buttons are compact (6px 12px)
- [ ] Spacing uses 4px multiples
- [ ] Focus states visible
- [ ] WCAG AA contrast (4.5:1 text)
- [ ] Mobile responsive
- [ ] Keyboard accessible
```

---

## 🚨 Common Mistakes

**DON'T:**

```css
/* ❌ Hardcoded color */
color: #d97757;

/* ❌ Purple */
color: #9333ea;

/* ❌ Blue for decoration */
color: #0066ff;

/* ❌ Arbitrary spacing */
padding: 14px 18px;

/* ❌ Large buttons */
padding: 10px 20px;
```

**DO:**

```css
/* ✅ CSS variable */
color: var(--accent);

/* ✅ Terracotta accent */
color: var(--accent);

/* ✅ Gray for info */
color: var(--info);

/* ✅ 4px multiple */
padding: var(--spacing-3) var(--spacing-4);

/* ✅ Compact button */
padding: 6px 12px;
```

---

## 📞 When Stuck

1. Check `DESIGN_SYSTEM.md` (full specs)
2. Look at `design-preview/design-system-preview.html` (live examples)
3. Use `src/assets/css/design-tokens.css` (copy tokens)
4. Ask in PR if unclear

---

**Last Updated:** 2025-01-12
**Theme:** Warm Minimal (Terracotta)
