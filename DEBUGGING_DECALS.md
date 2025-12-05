# 🔍 Debugging Decal Issues - Step by Step

## Current Problem
User reports: "just like we started, only full is working but not correctly, no other decal is showing"

## Changes Made

### 1. Fixed Model Switch Resetting Decals
**File**: `client/src/store/index.js` (lines 129-150)

**Problem**: When switching models, ALL decals were reset to empty and disabled
**Fix**: Keep logo enabled with default threejs.png image

```javascript
// Before:
state.isLogoTexture = false;  // ❌ Disabled
state.logoDecal = "";         // ❌ Empty

// After:
state.isLogoTexture = true;   // ✅ Enabled
state.logoDecal = "/threejs.png";  // ✅ Has default image
```

### 2. Added Comprehensive Debug Logging
**File**: `client/src/canvas/ModelViewer.jsx` (lines 197-215)

Added logs for:
- Decal state flags (isLogoTexture, isFullTexture, etc.)
- Decal data (SET or EMPTY)
- Positions being used
- Scales being used
- Textures loaded status

## Test Steps

### Step 1: Refresh Browser
1. Close browser completely
2. Reopen and go to http://localhost:5173
3. Click "Start Designing"

### Step 2: Load AGC Jacket
1. Click on "AGC Jacket" from Explore page
2. Opens Customizer page

### Step 3: Check Console Immediately
Look for these logs (before clicking any buttons):

```
✅ Using MANUAL positions for: /models/agc_jacket.glb
📍 Manual config: { logo: [...], back: [...], leftSleeve: [...], rightSleeve: [...], full: [...] }
⚙️ Final decal config: { positions: {...}, scale: {...} }
🎯 Decal states: {
  isLogoTexture: true,   // ✅ Should be TRUE
  isFullTexture: false,
  isBackTexture: false,
  isLeftSleeveTexture: false,
  isRightSleeveTexture: false,
  logoDecal: 'SET',      // ✅ Should be SET
  fullDecal: 'EMPTY',
  backDecal: 'EMPTY'
}
📍 Using positions: {...}
📏 Using scale: {...}
🔍 Textures loaded: {
  logoTexture: 'LOADED',  // ✅ Should be LOADED
  fullTexture: 'NULL',
  backTexture: 'NULL',
  leftSleeveTexture: 'NULL',
  rightSleeveTexture: 'NULL'
}
```

**Expected**: You should SEE the threejs.png logo on the LEFT chest area

### Step 4: Test Other Decals

#### Test Logo:
1. Click "File Picker" tab
2. Upload an image
3. Click "Logo" button
4. Check console - should show:
   ```
   🎯 Decal states: { isLogoTexture: true, logoDecal: 'SET' }
   🔍 Textures loaded: { logoTexture: 'LOADED' }
   ```
5. **Expected**: Logo should appear on LEFT chest

#### Test Back:
1. Upload an image
2. Click "Back" button (backShirt)
3. Check console - should show:
   ```
   🎯 Decal states: { isBackTexture: true, backDecal: 'SET' }
   🔍 Textures loaded: { backTexture: 'LOADED' }
   ```
4. Rotate model (camera orbit)
5. **Expected**: Decal on center back

#### Test Left Sleeve:
1. Upload an image
2. Click "Left Sleeve" button
3. Check console - should show:
   ```
   🎯 Decal states: { isLeftSleeveTexture: true, leftSleeveDecal: 'SET' }
   🔍 Textures loaded: { leftSleeveTexture: 'LOADED' }
   ```
4. **Expected**: Decal covers entire left sleeve

#### Test Right Sleeve:
1. Upload an image
2. Click "Right Sleeve" button
3. Check console
4. **Expected**: Decal covers entire right sleeve

#### Test Full:
1. Upload an image
2. Click "Full Texture" button (stylishShirt)
3. Check console - should show:
   ```
   🎯 Decal states: { isFullTexture: true, fullDecal: 'SET' }
   🔍 Textures loaded: { fullTexture: 'LOADED' }
   ```
4. **Expected**: Decal covers entire front

## Current Manual Positions for AGC Jacket

```javascript
"/models/agc_jacket.glb": {
  logo: [-0.12, 0.18, 0.16],       // Front LEFT top corner
  back: [0, 0.05, -0.16],          // Back center
  leftSleeve: [-0.25, 0.05, 0],    // Left sleeve
  rightSleeve: [0.25, 0.05, 0],    // Right sleeve
  full: [0, 0.05, 0.16],           // Full front coverage
}
```

```javascript
scale: {
  logo: 0.15,           // Small chest logo
  front: 0.25,          // Medium front
  back: 0.30,           // Larger back
  leftSleeve: 0.45,     // Large sleeve coverage
  rightSleeve: 0.45,    // Large sleeve coverage
  full: 1.0,            // Maximum coverage
}
```

## Potential Issues and Fixes

### Issue 1: Logo Not Visible
**Symptoms**: Logo texture loaded but not visible on model
**Possible Causes**:
- Position too far from model
- Position inside model geometry
- Scale too small
- Wrong rotation

**Debug**: Check console for position values
**Fix**: Adjust logo position in `decalpositions.js`

### Issue 2: Decal State Not Toggling
**Symptoms**: Clicking button doesn't enable decal
**Possible Causes**:
- Button not calling handleActiveFilterTab
- State not updating
- Component not re-rendering

**Debug**: Add console.log in handleActiveFilterTab
**Fix**: Check Customizer.jsx button handlers

### Issue 3: Texture Not Loading
**Symptoms**: Texture shows NULL in console
**Possible Causes**:
- Image file path wrong
- useTexture hook failing
- Image file corrupt

**Debug**: Check browser Network tab for image requests
**Fix**: Verify image exists at path

### Issue 4: Only Full Working
**Symptoms**: Full decal works, others don't
**Possible Causes**:
- Full position is correct, others are off
- Full button correctly sets state, others don't
- Full scale is appropriate, others too small/large

**Debug**: Compare console logs for Full vs Logo
**Fix**: Check button mappings in Customizer.jsx

## Next Steps

1. **User Testing Required**:
   - Refresh browser
   - Load AGC Jacket
   - Copy/paste console logs here
   - Tell me what you see visually

2. **Based on Logs**:
   - If flags are FALSE → Button mapping issue
   - If decals are EMPTY → Image upload issue
   - If textures are NULL → Texture loading issue
   - If all are correct but not visible → Position issue

3. **Position Adjustments**:
   - If logo too far left: Decrease x (make more negative)
   - If logo too far right: Increase x (make less negative)
   - If logo too high: Decrease y
   - If logo too low: Increase y
   - If logo behind model: Increase z
   - If logo too far forward: Decrease z

## Quick Reference: Expected Behavior

| Model | Logo | Back | Full | Sleeves |
|-------|------|------|------|---------|
| AGC Jacket | LEFT chest | Center back | Entire front | Shoulder to wrist |
| Cloth Jacket | LEFT chest | Center back | Entire front | Shoulder to wrist |
| Hooded Jacket | LEFT chest | Center back | Entire front | Shoulder to wrist |
| Hoodie | LEFT chest | Center back | Entire front | Shoulder to wrist |
| Indiana Jones | LEFT chest | Center back | Entire front | Shoulder to wrist |

All 5 models should behave identically with these positions!
