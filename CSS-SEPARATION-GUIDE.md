# CSS Separation System - MDPU Website

## Overview
Each page component now has its own dedicated CSS file for better organization, maintainability, and easier editing. This system makes it simple to update styles for specific pages without affecting others.

## File Structure

### Page Components and CSS Files (`src/pages/`)
```
src/pages/
├── about-us.tsx              → about-us.css
├── about-us.css
├── contact-us.tsx            → contact-us.css
├── contact-us.css
├── constitution-document.tsx → constitution-document.css
├── constitution-document.css
├── diaspora-chapters.tsx     → diaspora-chapters.css
├── diaspora-chapters.css
├── home-page.tsx             → home-page.css
├── home-page.css
├── join-membership.tsx       → join-membership.css
├── join-membership.css
├── leadership-team.tsx       → leadership-team.css
├── leadership-team.css
├── make-donation.tsx         → make-donation.css
├── make-donation.css
├── our-objectives.tsx        → our-objectives.css
├── our-objectives.css
├── our-projects.tsx          → our-projects.css
├── our-projects.css
├── upcoming-events.tsx       → upcoming-events.css
└── upcoming-events.css
```

## CSS Import Pattern

Each page component follows this pattern:

```tsx
// Example: src/pages/contact-us.tsx
import { PageHero } from "@/components/ui/custom/PageHero";
import { Section } from "@/components/ui/custom/Section";
// ... other imports
import "./contact-us.css";  // ← CSS import (same directory)

export default function ContactUs() {
  return (
    <div className="contact-us">  {/* ← CSS class for scoping */}
      {/* Component content */}
    </div>
  );
}
```

## CSS Scoping

Each CSS file uses a scoped class to prevent style conflicts:

```css
/* Example: src/pages/contact-us.css */
.contact-us {
  /* Main container styles */
}

.contact-us .contact-form {
  /* Form-specific styles */
}

.contact-us .form-input {
  /* Input field styles */
}

.contact-us .submit-button {
  /* Button styles */
}
```

## Benefits

1. **Easy Maintenance**: Each page's styles are isolated and easy to find
2. **No Conflicts**: Scoped CSS prevents style bleeding between pages
3. **Better Organization**: Clear separation of concerns
4. **Faster Development**: Quick to locate and modify specific page styles
5. **Scalable**: Easy to add new pages with their own CSS files

## How to Edit Styles

### To modify a specific page's styles:

1. **Find the page component**: Look in `src/pages/[page-name].tsx`
2. **Find the CSS file**: Look in `src/pages/[page-name].css` (same directory!)
3. **Edit the CSS**: All styles are scoped under the page's main class
4. **Test changes**: Run `npm run dev` to see changes in real-time

### Example: Editing Contact Page Styles

```bash
# 1. Edit the CSS file (same directory as TSX)
src/pages/contact-us.css

# 2. All styles are scoped under .contact-us class
.contact-us .form-input {
  border-color: var(--brand-forest);
  /* Your custom styles here */
}

# 3. Test the changes
npm run dev
```

## Build Output

The build system automatically creates separate CSS chunks for each page:

```
Route (pages)                           Size  First Load JS
├ ○ /about-us (661 ms)               13.2 kB         125 kB
├   └ chunks/f1dbe08229c435f4.css      920 B
├ ○ /contact-us (489 ms)             14.2 kB         206 kB
├   └ chunks/23c08f1f794d34a2.css    1.16 kB
├ ○ /make-donation (674 ms)          13.6 kB         125 kB
├   └ chunks/682e72bb678344a8.css    1.27 kB
```

This ensures optimal loading performance with page-specific CSS.

## Adding New Pages

When adding a new page:

1. **Create the component**: `src/pages/new-page.tsx`
2. **Create the CSS file**: `src/pages/new-page.css` (same directory!)
3. **Add the import**: `import "./new-page.css";`
4. **Scope your styles**: Use `.new-page` as the main class
5. **Add the route**: Create `src/app/new-page/page.tsx` that imports your component

## CSS Features Included

Each CSS file includes:
- ✅ Responsive design (mobile-first)
- ✅ Hover effects and transitions
- ✅ Brand color variables
- ✅ Animation classes
- ✅ Form styling
- ✅ Card layouts
- ✅ Typography
- ✅ Spacing and layout

This system makes your MDPU website highly maintainable and easy to customize! 🎉
