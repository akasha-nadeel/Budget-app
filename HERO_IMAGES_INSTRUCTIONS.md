# Instructions for Adding Your Custom Hero Images

## Step 1: Save Your Images
Save the two images you uploaded to the `public` folder with these exact names:
- `hero-light.webp` or `hero-light.png` - The blue budget icon (for light mode)
- `hero-dark.webp` or `hero-dark.png` - The yellow budget icon (for dark mode)

## Step 2: Update Dashboard.tsx
Once you've saved the images, update the image sources in `components/Dashboard.tsx`:

Replace these lines (around line 75-84):

```tsx
{/* Light Mode Image - Blue Budget Icon */}
<img 
  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800" 
  alt="Budget planning" 
  className={`w-full h-full object-cover opacity-40 mix-blend-overlay transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-40'}`}
/>
{/* Dark Mode Image - Yellow Budget Icon */}
<img 
  src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800" 
  alt="Budget planning dark" 
  className={`absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay transition-opacity duration-300 ${isDark ? 'opacity-30' : 'opacity-0'}`}
/>
```

With:

```tsx
{/* Light Mode Image - Blue Budget Icon */}
<img 
  src="/hero-light.webp" 
  alt="Budget planning" 
  className={`w-full h-full object-cover opacity-40 mix-blend-overlay transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-40'}`}
/>
{/* Dark Mode Image - Yellow Budget Icon */}
<img 
  src="/hero-dark.webp" 
  alt="Budget planning dark" 
  className={`absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay transition-opacity duration-300 ${isDark ? 'opacity-30' : 'opacity-0'}`}
/>
```

## Current Status
✅ Hero section now supports separate images for light and dark modes
✅ Smooth transitions between themes
✅ Temporary placeholder images from Unsplash are being used
⏳ Waiting for your custom images to be added to the `public` folder
