# Hybrid Decal Positioning System

## Overview

The system now uses **HYBRID MODE** - combining manual positions with automatic geometry detection.

## How It Works

### 1. For Each Model Loaded:

1. **Check if manual positions exist** in `decalpositions.js`
2. **If YES**: Use manual positions
3. **If NO**: Use automatic geometry calculation

### 2. Automatic Calculation (`calculateDecalPositions`)

For models without manual positions, the system:

1. **Analyzes the 3D geometry** (bounding box, width, height, depth)
2. **Calculates center point**
3. **Automatically positions decals** based on geometry:
   - **Logo**: Front left chest (polo-style)
   - **Left Sleeve**: Left arm area (negative X)
   - **Right Sleeve**: Right arm area (positive X)
   - **Back**: Center back
   - **Full**: Complete front coverage

4. **Calculates optimal scale** based on model size

## Current Model Configuration

### Manual Positions (Working Well):
- ✅ `/models/shirt_baked.glb` - T-Shirt
- ✅ `/models/jean_jacket.glb` - Jean Jacket
- ✅ `/models/the_pants.glb` - Pants (special config)

### Automatic Calculation (Let geometry decide):
- 🤖 `/models/agc_jacket.glb` - AGC Jacket
- 🤖 `/models/cloth_jacket.glb` - Cloth Jacket
- 🤖 `/models/hooded_jacket.glb` - Hooded Jacket
- 🤖 `/models/hoodie.glb` - Hoodie
- 🤖 `/models/womens_top.glb` - Women's Top
- 🤖 `/models/varsity_jacket.glb` - Varsity Jacket
- 🤖 `/models/indiana_jones_wested_leather_coat.glb` - Indiana Jones Coat
- 🤖 All other models without manual config

## Automatic Calculation Logic

```javascript
// Logo Position
logo: [
  center.x - width * 0.15,     // LEFT chest (negative x)
  center.y + height * 0.25,    // Upper chest
  bbox.max.z + depth * 0.10    // Front surface with offset
]

// Left Sleeve Position
leftSleeve: [
  bbox.min.x - width * 0.15,   // LEFT arm (min x, more negative)
  center.y + height * 0.1,     // Upper arm height
  center.z + depth * 0.05      // Slightly forward
]

// Right Sleeve Position
rightSleeve: [
  bbox.max.x + width * 0.15,   // RIGHT arm (max x, more positive)
  center.y + height * 0.1,     // Upper arm height
  center.z + depth * 0.05      // Slightly forward
]

// Back Position
back: [
  center.x,                     // Center
  center.y + height * 0.05,    // Slightly above center
  bbox.min.z - depth * 0.10    // Back surface with offset
]

// Full Position
full: [
  center.x,                     // Center
  center.y,                     // Center
  bbox.max.z + depth * 0.08    // Front surface
]
```

## Automatic Scaling

Scales are calculated based on model size:

```javascript
const avgDimension = (width + height) / 2;

scale: {
  logo: avgDimension * 0.25,      // Small chest logo
  front: avgDimension * 0.35,     // Medium front
  back: avgDimension * 0.40,      // Larger back
  leftSleeve: avgDimension * 0.50, // Large sleeve coverage
  rightSleeve: avgDimension * 0.50, // Large sleeve coverage
  full: avgDimension * 1.2,       // Maximum coverage
}
```

## Console Debugging

When a model loads, check console for:

```
✅ Using MANUAL positions for: /models/shirt_baked.glb
📍 Manual config: {...}
```

OR

```
🤖 Using AUTOMATIC calculation for: /models/agc_jacket.glb
📏 Model Dimensions: { width: 2.5, height: 3.2, depth: 1.8 }
📍 Model Center: { x: 0, y: 1.2, z: 0.1 }
✅ Calculated decal positions: {...}
📐 Calculated decal scales: {...}
```

## Adding Manual Positions

If automatic positions don't work well for a model:

1. Open `client/src/config/decalpositions.js`
2. Add the model with manual positions:

```javascript
"/models/your_model.glb": {
    logo: [-0.08, 0.12, 0.15],
    back: [0, 0.04, -0.15],
    leftSleeve: [-0.18, 0.04, 0],
    rightSleeve: [0.18, 0.04, 0],
    collar: [0, 0.15, 0.12],
    tag: [0, -0.15, -0.13],
    full: [0, 0.04, 0.15],
},
```

3. Save and refresh browser
4. Model will now use manual positions

## Removing Manual Positions

To switch a model to automatic calculation:

1. Open `client/src/config/decalpositions.js`
2. Comment out or delete the model's entry
3. Save and refresh
4. Model will now use automatic calculation

## Benefits of Hybrid System

✅ **Automatic models adapt to geometry** - No manual positioning needed
✅ **Manual overrides when needed** - Fine control for important models
✅ **Faster setup for new models** - Just add the model, positions calculate automatically
✅ **Easy testing** - Try automatic first, add manual only if needed

## Testing a New Model

1. Add model to `/client/public/models/`
2. Add to Explore page products list
3. Load in customizer
4. Check console logs for automatic calculation
5. Test all decal positions
6. If positions are off, add manual config

## Special Cases

### Pants (`/models/the_pants.glb`)
- Uses special waistband configuration
- Logo: Front left waist
- Belt area: For belt designs
- Full: Front leg coverage
- Left/Right sleeve unused (would be for legs)

### Women's Top (Previously Crashing)
- Now uses automatic calculation
- No more `meshName` conflicts
- Should work smoothly

## Troubleshooting

### Model not showing decals at all
1. Check console for "No mesh found"
2. Model might have multiple meshes
3. Try adding manual positions

### Decals in wrong positions
1. Check console logs for calculated positions
2. Note the values
3. Add manual positions based on console output
4. Adjust as needed

### Decals too small/large
1. Check console for calculated scales
2. Scales are based on model size
3. Larger models get larger scales automatically

## Next Steps

1. Test all models with automatic calculation
2. Identify which ones need manual positions
3. Add manual positions only where needed
4. Keep most models on automatic for easier maintenance
