# Decal Positioning Update - Final Adjustments

## Changes Made

### 1. Logo Position: RIGHT → LEFT Chest ✅

**Before**: Logo was on RIGHT chest (positive x)
**After**: Logo is on LEFT chest (negative x)

```javascript
// Position adjusted
logo: [
  center.x - width * 0.20,     // LEFT side (negative x, more to the left)
  center.y + height * 0.28,    // Upper chest
  bbox.max.z + depth * 0.12    // Front surface with offset
]
```

### 2. Logo Shape: SQUARE (Not Stretched) ✅

**Before**: Logo scale was a single number, could appear stretched
**After**: Logo scale is [x, y, z] with equal values = perfect square

```javascript
// In ModelViewer.jsx
<Decal
  position={positions.logo}
  rotation={[0, 0, 0]}
  scale={[scale.logo, scale.logo, scale.logo]}  // ✅ Equal on all axes = SQUARE
  map={logoTexture}
/>
```

**Scale Calculation**:
```javascript
logo: avgDimension * 0.20,  // Small, square chest logo
```

### 3. Sleeves: Cover ENTIRE Arm (Shoulder to Wrist) ✅

**Before**: Sleeves only on upper arm
**After**: Sleeves cover entire arm from shoulder to wrist

**Position Changes**:
```javascript
// Left Sleeve - Positioned at shoulder edge, centered vertically
leftSleeve: [
  bbox.min.x - width * 0.05,   // LEFT arm at shoulder edge
  center.y,                    // Mid-arm height (vertical center of arm)
  center.z                     // Center depth (side view)
]

// Right Sleeve - Positioned at shoulder edge, centered vertically
rightSleeve: [
  bbox.max.x + width * 0.05,   // RIGHT arm at shoulder edge
  center.y,                    // Mid-arm height (vertical center of arm)
  center.z                     // Center depth (side view)
]
```

**Scale Changes** (Most Important):
```javascript
// Scale based on HEIGHT (arm length from shoulder to wrist ≈ model height)
leftSleeve: height * 0.60,   // 60% of model height = covers entire arm
rightSleeve: height * 0.60,  // 60% of model height = covers entire arm
```

## Summary of All Decal Scales

```javascript
scale: {
  logo: avgDimension * 0.20,      // Small square logo on LEFT chest
  front: avgDimension * 0.35,     // Medium front design
  back: avgDimension * 0.40,      // Larger back design
  leftSleeve: height * 0.60,      // Covers entire left arm (shoulder to wrist)
  rightSleeve: height * 0.60,     // Covers entire right arm (shoulder to wrist)
  full: avgDimension * 1.2,       // Maximum full coverage
}
```

## Expected Results After Refresh

### Logo:
- ✅ Positioned on **LEFT chest** (polo-style)
- ✅ **Square shape** (not stretched or distorted)
- ✅ Smaller, more subtle size
- ✅ Default threejs.png visible on all models

### Sleeves:
- ✅ **Left sleeve** covers entire left arm from shoulder to wrist
- ✅ **Right sleeve** covers entire right arm from shoulder to wrist
- ✅ Scale proportional to model height
- ✅ Positioned at shoulder edge, centered vertically on arm

### Back:
- ✅ Already working perfectly (center back)
- ✅ No changes needed

### Full:
- ✅ Already working perfectly (entire front coverage)
- ✅ No changes needed

## Files Modified

1. **`client/src/utils/decalPositionCalculator.js`**
   - Line 36: Logo position moved LEFT (width * 0.20)
   - Line 37: Logo position raised slightly (height * 0.28)
   - Line 57-59: Left sleeve position adjusted for full arm coverage
   - Line 64-66: Right sleeve position adjusted for full arm coverage
   - Line 82: Logo scale reduced to 0.20 (smaller, square)
   - Line 85-86: Sleeve scale changed to `height * 0.60` (full arm coverage)

2. **`client/src/canvas/ModelViewer.jsx`**
   - Line 237: Logo scale changed to `[scale.logo, scale.logo, scale.logo]` (square shape)

## Test Instructions

1. **Refresh browser** (Ctrl+Shift+R)
2. **Load any model** (AGC Jacket, Hoodie, etc.)
3. **Check Logo**:
   - Should see threejs.png on LEFT chest
   - Should be SQUARE (not stretched)
   - Should be smaller than before

4. **Upload an image**
5. **Test Left Sleeve**:
   - Click "Left Sleeve" button
   - Should cover entire left arm from shoulder to wrist

6. **Test Right Sleeve**:
   - Click "Right Sleeve" button
   - Should cover entire right arm from shoulder to wrist

7. **Verify Back and Full** (should still work perfectly)

## Adjustment Reference

If sleeves still don't cover entire arm:

| Issue | Change | File | Line |
|-------|--------|------|------|
| Sleeve too short | Increase scale multiplier | decalPositionCalculator.js | 85-86 |
| Example: | `height * 0.60` → `height * 0.75` | | |
| Sleeve too long | Decrease scale multiplier | | |
| Example: | `height * 0.60` → `height * 0.50` | | |
| Sleeve too far from model | Decrease width offset | decalPositionCalculator.js | 57, 64 |
| Example: | `width * 0.05` → `width * 0.03` | | |

If logo needs fine-tuning:

| Issue | Change | File | Line |
|-------|--------|------|------|
| Logo too far RIGHT | Increase multiplier (more negative) | decalPositionCalculator.js | 36 |
| Example: | `width * 0.20` → `width * 0.25` | | |
| Logo too far LEFT | Decrease multiplier (less negative) | | |
| Example: | `width * 0.20` → `width * 0.15` | | |
| Logo too small | Increase scale | decalPositionCalculator.js | 82 |
| Example: | `0.20` → `0.25` | | |
| Logo too large | Decrease scale | | |
| Example: | `0.20` → `0.15` | | |

## Console Output to Check

When model loads, verify:

```
🤖 Using AUTOMATIC calculation for: /models/agc_jacket.glb
📏 Model Dimensions: { width: X, height: Y, depth: Z }
📍 Model Center: { x: 0, y: 1.2, z: 0.1 }
✅ Calculated decal positions: {
  logo: [negative_x, positive_y, positive_z],  // Should be negative x (LEFT)
  leftSleeve: [very_negative_x, center_y, center_z],
  rightSleeve: [very_positive_x, center_y, center_z],
  ...
}
📐 Calculated decal scales: {
  logo: ~0.5,           // Small
  leftSleeve: ~1.5,     // Large (based on height)
  rightSleeve: ~1.5,    // Large (based on height)
  ...
}
```

All decals should now work perfectly! 🎯
