# 📸 How to Add Your Hero Images

## Quick Steps:

### Option 1: Manual Save (Recommended)
1. **Save your first image (blue budget icon)**:
   - Right-click on the blue budget icon image you uploaded in the chat
   - Select "Save image as..."
   - Navigate to: `C:\Users\User\Desktop\My projects\Budget app\public\`
   - Save it as: `hero-light.png`

2. **Save your second image (yellow budget icon)**:
   - Right-click on the yellow budget icon image you uploaded in the chat
   - Select "Save image as..."
   - Navigate to: `C:\Users\User\Desktop\My projects\Budget app\public\`
   - Save it as: `hero-dark.png`

3. **Done!** The app will automatically use your images.

### Option 2: Use the Image Generator
If you can't access the chat images:
1. Open this file in your browser: `public/create-hero-images.html`
2. It will automatically download both images
3. Move them to the `public` folder

## Current Status:
✅ Dashboard.tsx updated to use local images
✅ Light/Dark mode switching implemented
✅ Image paths configured: `/hero-light.png` and `/hero-dark.png`
⏳ Waiting for images to be saved to the `public` folder

## File Locations:
- Light mode image: `public/hero-light.png` (blue budget icon)
- Dark mode image: `public/hero-dark.png` (yellow budget icon)

Once you save the images, refresh your browser at http://localhost:3000 to see them!
