# LCT Design System Preview

## 🎨 Interactive Design System Preview

This directory contains an **interactive HTML preview** of the proposed LCT design system.

## 📁 Files

- **`design-system-preview.html`** - Interactive preview with 3 design directions

## 🚀 How to Use

### Option 1: Open Directly
```bash
# Navigate to the directory
cd design-preview

# Open in your default browser (macOS)
open design-system-preview.html

# Or on Linux
xdg-open design-system-preview.html

# Or on Windows
start design-system-preview.html
```

### Option 2: Double-Click
Just double-click `design-system-preview.html` in Finder/Explorer

## 🎭 Available Themes

The preview includes 3 design directions you can toggle between:

### 1. Anthropic-Inspired (Warm Minimal)
- **Primary:** #131314 (charcoal)
- **Accent:** #d97757 (terracotta) - replaces purple!
- **Feel:** Warm, approachable, professional
- **Inspired by:** Anthropic/Claude design system

### 2. OpenAI-Inspired (Bold Tech)
- **Primary:** #000000 (pure black)
- **Accent:** #0066FF (vibrant blue)
- **Feel:** Bold, technical, innovative
- **Inspired by:** OpenAI 2025 rebrand

### 3. Hybrid (Best of Both)
- **Primary:** #0a0a0a (near-black)
- **Accent:** #0066FF (blue)
- **Feel:** Balanced, professional, trustworthy
- **Combines:** Best elements of both systems

## 🔍 What's Included

The preview demonstrates:

- ✅ **Color Palettes** - All semantic colors (NO PURPLE!)
- ✅ **Typography** - Complete font hierarchy
- ✅ **Buttons** - All variants (primary, secondary, ghost, destructive)
- ✅ **Badges** - Priority labels without purple
- ✅ **Cards** - Content containers
- ✅ **Stats Cards** - Dashboard metrics
- ✅ **Forms** - Input fields, selects, textareas
- ✅ **Navigation** - Tab patterns

## 💡 Decision Points

After reviewing the preview, you need to decide:

1. **Which theme direction?**
   - Anthropic (warm)
   - OpenAI (bold)
   - Hybrid (balanced)

2. **Any adjustments needed?**
   - Colors
   - Typography sizes
   - Component styles

## 📝 Next Steps

Once you've reviewed and chosen a direction:

1. **Approve the design** - Tell Claude which theme you prefer
2. **Full design system doc** - Complete documentation will be created
3. **CSS variables file** - Extract as `design-tokens.css`
4. **Apply to app** - Update existing HTML files
5. **Create PR** - Review and merge

## 🎯 Key Features

- **Interactive** - Switch themes with one click
- **Comprehensive** - Shows all components
- **Standalone** - No dependencies, works offline
- **Zero Risk** - Doesn't modify your actual app

## 📊 Comparison

| Feature | Current | New Design |
|---------|---------|------------|
| Purple accent | ❌ #9333ea | ✅ Replaced with blue/terracotta |
| Spacing | ❌ Inconsistent | ✅ 8px base scale |
| Colors | ❌ Hardcoded | ✅ CSS variables |
| Theme switching | ❌ No | ✅ Ready for dark mode |
| Design system | ❌ None | ✅ Complete documentation |

## 🔗 Resources

- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [Anthropic Design](https://www.anthropic.com)
- [OpenAI Design](https://openai.com)

---

**Created:** 2025-01-12
**Status:** Preview - Awaiting Approval
**Branch:** `feature/design-system-preview`
