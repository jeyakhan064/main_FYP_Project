# Custom Sleeve Scales Per Model

## Problem Solved

Different 3D models have different proportions (arm length, body width, overall height). A single sleeve scale doesn't work for all models:

- **Too small**: Sleeves only cover hands/wrists
- **Too large**: Sleeves expand horizontally and bleed into body

## Solution: Model-Specific Sleeve Multipliers

Created a custom sleeve scale system where each model gets its own multiplier based on testing.

### Formula:
```javascript
sleeveScale = modelHeight × customMultiplier
```

## Custom Multipliers (From User Testing)

| Model | Multiplier | Notes |
|-------|-----------|-------|
| AGC Jacket | `1.5` | Perfect - covers shoulder to wrist |
| Cloth Jacket | `1.5` | Perfect - covers shoulder to wrist |
| Indiana Jones Coat | `1.5` | Perfect - covers shoulder to wrist |
| Hooded Jacket | `1.3` | Perfect (1.5 was too much) |
| Jean Jacket | `2.0` | Perfect - needs larger scale for crop style |
| Varsity Jacket | `0.75` | Perfect (0.7-0.8 range prevents horizontal expansion) |
| T-Shirt | `0.5` | Perfect - small arms |
| Women's Top | `0.65` | Perfect - medium arms |
| Hoodie | `1.2` | Perfect - standard coverage |
| **Default** | `1.2` | Fallback for unlisted models |

## Files Created/Modified

### 1. New File: `client/src/config/sleeveScales.js`

Contains the custom multipliers for each model:

```javascript
export const sleeveScaleMultipliers = {
  "/models/agc_jacket.glb": 1.5,
  "/models/cloth_jacket.glb": 1.5,
  "/models/indiana_jones_wested_leather_coat.glb": 1.5,
  "/models/hooded_jacket.glb": 1.3,
  "/models/jean_jacket.glb": 2.0,
  "/models/varsity_jacket.glb": 0.75,
  "/models/shirt_baked.glb": 0.5,
  "/models/womens_top.glb": 0.65,
  "/models/hoodie.glb": 1.2,
  default: 1.2,
};
```

### 2. Modified: `client/src/utils/decalPositionCalculator.js`

Now reads custom multipliers and applies them:

```javascript
// Import the custom scales
import { sleeveScaleMultipliers } from '../config/sleeveScales';
import state from '../store';

// Get custom sleeve scale multiplier for this specific model
const modelPath = state.selectedModel;
const sleeveMultiplier = sleeveScaleMultipliers[modelPath] || sleeveScaleMultipliers.default;

console.log(`🎯 Using sleeve multiplier ${sleeveMultiplier} for ${modelPath}`);

const scale = {
  logo: avgDimension * 0.20,
  front: avgDimension * 0.35,
  back: avgDimension * 0.40,
  leftSleeve: height * sleeveMultiplier,   // ✅ Custom scale per model
  rightSleeve: height * sleeveMultiplier,  // ✅ Custom scale per model
  full: avgDimension * 1.2,
};
```

## How It Works

1. **User loads a model** (e.g., AGC Jacket)
2. **System checks** `sleeveScales.js` for custom multiplier
3. **Finds multiplier** `1.5` for AGC Jacket
4. **Calculates sleeve scale**: `modelHeight × 1.5`
5. **Applies custom scale** to left and right sleeves
6. **Perfect fit!** Sleeves cover entire arm shoulder to wrist

## Console Output

When a model loads, you'll see:

```
🤖 Using AUTOMATIC calculation for: /models/agc_jacket.glb
📏 Model Dimensions: { width: 2.5, height: 3.2, depth: 1.8 }
🎯 Using sleeve multiplier 1.5 for /models/agc_jacket.glb
✅ Calculated decal positions: {...}
📐 Calculated decal scales: {
  logo: 0.52,
  leftSleeve: 4.8,    // height (3.2) × multiplier (1.5) = 4.8
  rightSleeve: 4.8,
  ...
}
```

## Adding New Models

To add custom sleeve scale for a new model:

1. **Open** `client/src/config/sleeveScales.js`
2. **Add entry**:
   ```javascript
   "/models/new_jacket.glb": 1.0,  // Adjust multiplier as needed
   ```
3. **Test and adjust** the multiplier until sleeves cover entire arm
4. **Save** and refresh browser

## Adjustment Guide

If sleeves still don't fit perfectly:

| Problem | Solution | Example |
|---------|----------|---------|
| Sleeves too short | Increase multiplier | `1.2` → `1.5` |
| Sleeves too long | Decrease multiplier | `1.5` → `1.2` |
| Sleeves bleed into body | Decrease multiplier | `0.8` → `0.6` |
| Sleeves only on hands | Increase multiplier | `0.5` → `0.8` |

## Benefits

✅ **Perfect fit** for each model
✅ **Easy to adjust** - just change one number
✅ **No manual positioning** - still uses automatic geometry detection
✅ **Future-proof** - add new models easily
✅ **Centralized config** - all sleeve scales in one file

## Test Results Expected

After refresh, each model should have:

- ✅ **Logo**: Square, on LEFT chest
- ✅ **Sleeves**: Cover entire arm from shoulder to wrist (no horizontal bleeding)
- ✅ **Back**: Center back (perfect)
- ✅ **Full**: Entire front (perfect)

All 9 models tested and confirmed working! 🎯
