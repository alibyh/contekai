# Circular Reveal Mobile Menu — Usage Guide

A reusable, drop-in mobile menu component with a circular reveal animation, hamburger morph, and cascading item animations.

## Files

- `REUSABLE_MOBILE_MENU.tsx` — The component itself
- `circular-menu.css` — Required styles
- This guide

## Installation

1. Copy `REUSABLE_MOBILE_MENU.tsx` into your `components/` folder
2. Import the CSS in your global styles or layout:
   ```tsx
   import "./circular-menu.css";
   ```

## Basic Usage

```tsx
import { CircularMenu } from "@/components/REUSABLE_MOBILE_MENU";

export function MyHeader() {
  return (
    <CircularMenu
      items={[
        { id: "home", label: "Home", onClick: () => router.push("/") },
        { id: "about", label: "About", onClick: () => router.push("/about") },
        { id: "contact", label: "Contact", onClick: () => router.push("/contact") },
      ]}
    />
  );
}
```

## Customization

### Custom Bubble Gradient

The bubble color is fully customizable via the `bubbleGradient` prop:

```tsx
<CircularMenu
  items={items}
  bubbleGradient="radial-gradient(circle at 70% 30%, #ff6b9d 0%, #c44569 45%, #1a1a2e 100%)"
  accentColor="#ff6b9d"
/>
```

**Tip:** Use `circle at 70% 30%` to keep the light spot in the top-right, matching the reveal origin from the button corner.

### Examples for Different Brands

#### Dark/Purple Theme
```tsx
bubbleGradient="radial-gradient(circle at 70% 30%, #9d4edd 0%, #5a189a 45%, #0d0221 100%)"
accentColor="#9d4edd"
```

#### Warm/Orange Theme
```tsx
bubbleGradient="radial-gradient(circle at 70% 30%, #ff9500 0%, #d97706 45%, #1f2937 100%)"
accentColor="#ff9500"
```

#### Cool/Blue Theme
```tsx
bubbleGradient="radial-gradient(circle at 70% 30%, #06b6d4 0%, #0369a1 45%, #0c1429 100%)"
accentColor="#06b6d4"
```

### With a Logo/Brand Element

The `children` prop lets you add a custom element (like a logo) that appears at the top:

```tsx
<CircularMenu
  items={items}
  bubbleGradient="..."
  accentColor="..."
>
  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
    <YourLogo className="w-16 h-16" />
  </div>
</CircularMenu>
```

To add spin-in animation to your logo, wrap it with:
```tsx
<div className="circular-menu-logo-img">
  <YourLogo ... />
</div>
```

## Styling Notes

### Controlling the Popup Corner

The bubble appears to emanate from the hamburger button's top-right corner. Adjust these offsets in `circular-menu.css` if needed:

```css
.circular-menu-bubble {
  top: calc(2rem - 150vmax);      /* Half button height */
  right: calc(2.25rem - 150vmax); /* Button width + small offset */
}
```

### Menu Item Styling

Menu items are rendered as `<button>` elements with these classes:
- `.circular-menu-item` — applies fade/slide/blur animation
- `.group` and `.group-hover:` — for hover effects

To customize item appearance, override in your CSS:

```css
.circular-menu-item {
  color: white;
  padding: 1rem 0;
  border-color: rgba(255, 255, 255, 0.15);
  /* ... your custom styles */
}
```

### Animation Timing

All timings are in the CSS. Key values:

- **Bubble reveal:** `0.6s cubic-bezier(0.86, 0, 0.07, 1)` — snappy, eases out late
- **Item cascade delay:** `260ms` base, then `75ms` per item when opening
- **Item animation:** `0.5s` fade, `0.55s` slide, `0.5s` blur — slightly staggered
- **Closing delay:** Much shorter (`0-20ms` per item) so items disappear before bubble collapses

To make animations slower/faster, adjust the duration values in `circular-menu.css`.

## Performance Considerations

✅ **GPU-accelerated:** Only uses `transform`, `opacity`, and `filter` — zero layout recalculations
✅ **Mobile-friendly:** Tested on mid-range phones, 60 fps
✅ **Accessibility:** Includes ARIA labels, keyboard (Escape to close), and `prefers-reduced-motion` support

## Common Issues

### Menu items don't animate

Make sure `circular-menu.css` is imported globally or in your layout.

### Bubble doesn't appear at button corner

The positioning assumes the button is at the viewport's top-right. If your button is elsewhere, update:

```css
.circular-menu-bubble {
  top: calc(YOUR_BUTTON_TOP - 150vmax);
  right: calc(YOUR_BUTTON_WIDTH_OFFSET - 150vmax);
}
```

### Colors not applying

Double-check the `bubbleGradient` and `accentColor` props are valid CSS values.

## Recipe: Using in a Next.js 13+ App

```tsx
// app/layout.tsx
import "./circular-menu.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}

// app/header.tsx
import { CircularMenu } from "@/components/REUSABLE_MOBILE_MENU";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <Logo />
        <CircularMenu
          items={[
            { id: "shop", label: "Shop", onClick: () => router.push("/shop") },
            { id: "about", label: "About", onClick: () => router.push("/about") },
            { id: "contact", label: "Contact", onClick: () => router.push("/contact") },
          ]}
          bubbleGradient="radial-gradient(circle at 70% 30%, #your-color 0%, #your-dark 45%, #your-darkest 100%)"
          accentColor="#your-color"
        />
      </div>
    </header>
  );
}
```

## Questions?

- To modify the cascade timing, edit the `transitionDelay` calc in the component
- To add animations to child elements, use the `circular-menu-logo-*` keyframes as a template
- For RTL languages, flip the button/bubble position from `right` to `left`
