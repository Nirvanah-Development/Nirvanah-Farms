console.log(`
🔧 Development Cache Clear Instructions
=====================================

If you're experiencing TypeError issues with undefined properties:

1. Clear Browser Cache:
   - Chrome/Edge: Ctrl+Shift+Delete → Select "All time" → Check "Cached images and files"
   - Firefox: Ctrl+Shift+Delete → Select "Everything" → Check "Cache"
   - Or use Dev Tools: F12 → Right-click refresh → "Empty Cache and Hard Reload"

2. Clear Local Storage:
   - Open Dev Tools (F12)
   - Go to Application/Storage tab
   - Find "Local Storage" → localhost:3000
   - Delete "cart-storage" key

3. Hard Refresh:
   - Windows: Ctrl+F5 or Ctrl+Shift+R
   - Mac: Cmd+Shift+R

4. Clear Next.js cache:
   npm run build
   
5. If still having issues, try incognito/private mode to verify it's a caching issue.

The app has been updated with better error handling to prevent this issue in the future.
`);

// You can also programmatically clear localStorage in the browser console:
// localStorage.removeItem('cart-storage');
// location.reload(); 