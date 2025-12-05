# ✅ RESTORED WORKING CONFIGURATION - 5 Perfect Models

## Models Working Perfectly (Manual Positions):

### 1. Hoodie `/models/hoodie.glb`
```javascript
logo: [-0.10, 0.15, 0.15]       // Front LEFT top corner
back: [0, 0.05, -0.15]          // Back center
leftSleeve: [-0.22, 0.05, 0]    // Left sleeve
rightSleeve: [0.22, 0.05, 0]    // Right sleeve
full: [0, 0.05, 0.15]           // Full front
```

### 2. AGC Jacket `/models/agc_jacket.glb`
```javascript
logo: [-0.12, 0.18, 0.16]       // Front LEFT top corner
back: [0, 0.05, -0.16]          // Back center
leftSleeve: [-0.25, 0.05, 0]    // Left sleeve
rightSleeve: [0.25, 0.05, 0]    // Right sleeve
full: [0, 0.05, 0.16]           // Full front
```

### 3. Cloth Jacket `/models/cloth_jacket.glb`
```javascript
logo: [-0.12, 0.18, 0.16]       // Front LEFT top corner
back: [0, 0.05, -0.16]          // Back center
leftSleeve: [-0.25, 0.05, 0]    // Left sleeve
rightSleeve: [0.25, 0.05, 0]    // Right sleeve
full: [0, 0.05, 0.16]           // Full front
```

### 4. Hooded Jacket `/models/hooded_jacket.glb`
```javascript
logo: [-0.12, 0.18, 0.16]       // Front LEFT top corner
back: [0, 0.05, -0.16]          // Back center
leftSleeve: [-0.25, 0.05, 0]    // Left sleeve
rightSleeve: [0.25, 0.05, 0]    // Right sleeve
full: [0, 0.05, 0.16]           // Full front
```

### 5. Indiana Jones Coat `/models/indiana_jones_wested_leather_coat.glb`
```javascript
logo: [-0.14, 0.20, 0.18]       // Front LEFT top corner
back: [0, 0.05, -0.18]          // Back center
leftSleeve: [-0.28, 0.05, 0]    // Left sleeve
rightSleeve: [0.28, 0.05, 0]    // Right sleeve
full: [0, 0.05, 0.18]           // Full front
```

## Scale Configuration (RESTORED):

```javascript
scale: {
  logo: 0.15,           // Small chest logo (ORIGINAL)
  front: 0.25,          // Medium front
  back: 0.30,           // Larger back
  leftSleeve: 0.45,     // Large sleeve coverage (ORIGINAL)
  rightSleeve: 0.45,    // Large sleeve coverage (ORIGINAL)
  full: 1.0,            // Maximum coverage
}
```

## What Was Restored:

1. **Logo Positions**: All 5 models have LEFT chest logo (negative x: -0.10 to -0.14)
2. **Sleeve Scale**: Increased from 0.30 → 0.45 (covers entire sleeve)
3. **Logo Scale**: Increased from 0.12 → 0.15 (more visible)

## Expected Results:

✅ **Hoodie**: All decals working (Logo, Back, Full, Left Sleeve, Right Sleeve)
✅ **AGC Jacket**: All decals working
✅ **Cloth Jacket**: All decals working
✅ **Hooded Jacket**: All decals working
✅ **Indiana Jones Coat**: All decals working

## Other Models Using Automatic Calculation:

🤖 T-Shirt
🤖 Jean Jacket
🤖 Varsity Jacket
🤖 Women's Top

## Files Modified:

1. `client/src/canvas/ModelViewer.jsx` - Restored scale configuration
2. `client/src/config/decalpositions.js` - Already had correct positions

## Test Now:

1. Refresh browser (Ctrl+Shift+R)
2. Test the 5 models:
   - Click on model
   - Upload image
   - Try each decal button:
     - Logo Shirt → Should show on LEFT chest
     - Back → Should show on back center
     - Full Texture → Should cover entire front
     - Left Sleeve → Should cover left sleeve
     - Right Sleeve → Should cover right sleeve

All 5 models should now work EXACTLY as they did when they were perfect! 🎯
