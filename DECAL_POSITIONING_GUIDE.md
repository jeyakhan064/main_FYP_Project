# Manual Decal Positioning Guide

This guide explains how to manually adjust decal positions for each 3D model in your Fashion Forge project.

---

## Understanding the System

### Current Files
1. **`client/src/config/decalpositions.js`** - Manual position overrides (YOU EDIT THIS)
2. **`client/src/utils/decalPositionCalculator.js`** - Automatic calculator (fallback only)
3. **`client/src/canvas/ModelViewer.jsx`** - Renders models with decals

### Position Coordinates

Each decal position is an array: `[x, y, z]`

- **X-axis**: Left to Right
  - Negative values = Left side
  - Positive values = Right side
  - `0` = Center

- **Y-axis**: Bottom to Top
  - Negative values = Lower
  - Positive values = Higher
  - `0` = Middle height

- **Z-axis**: Back to Front
  - Negative values = Back of model
  - Positive values = Front of model
  - `0` = Center depth

**Example**: `[0, 0.04, 0.15]`
- `0` = Horizontally centered
- `0.04` = Slightly above center
- `0.15` = Front of the model

---

## Step-by-Step: Adjusting Positions

### Step 1: Open the Manual Positions File

Edit: `client/src/config/decalpositions.js`

### Step 2: Find Your Model

Locate the model path in the file. For example:

```javascript
"/models/agc_jacket.glb": {
    logo: [0, 0.05, 0.16],        // Front chest logo
    back: [0, 0.05, -0.16],        // Back center
    leftSleeve: [-0.22, 0.05, 0.08],  // Left sleeve
    rightSleeve: [0.22, 0.05, 0.08],  // Right sleeve
    collar: [0, 0.18, 0.12],       // Collar/neck area
    tag: [0, -0.15, -0.14],        // Back tag
    full: [0, 0.05, 0.16],         // Full front texture
},
```

### Step 3: Test Current Positions

1. Start your dev server:
```bash
cd client
npm run dev
```

2. Open browser and navigate to: `http://localhost:5173`

3. Click **Explore** → Select your model → Click **Customize**

4. Open **Browser Console** (F12 or Ctrl+Shift+I)

5. Upload an image to see where decals appear

### Step 4: Adjust Positions

Common adjustments:

#### Move Logo Higher
```javascript
// OLD
logo: [0, 0.05, 0.16],

// NEW - Move up by increasing Y
logo: [0, 0.10, 0.16],  // +0.05 higher
```

#### Move Logo Left
```javascript
// OLD
logo: [0, 0.05, 0.16],

// NEW - Move left with negative X
logo: [-0.05, 0.05, 0.16],  // Shifted left
```

#### Move Logo Closer to Surface
```javascript
// OLD
logo: [0, 0.05, 0.16],

// NEW - Increase Z to bring forward
logo: [0, 0.05, 0.20],  // Closer to front
```

#### Adjust Sleeve Position
```javascript
// OLD
leftSleeve: [-0.22, 0.05, 0.08],

// NEW - Move further out and higher
leftSleeve: [-0.28, 0.10, 0.08],  // Further left + higher
```

### Step 5: Save and Test

1. **Save** `decalpositions.js`
2. **Refresh** browser (or hot reload should work)
3. **Check** the decal position
4. **Repeat** adjustments as needed

---

## Quick Reference: Common Position Fixes

### Logo Too Low
```javascript
logo: [0, 0.10, 0.16],  // Increase Y value
```

### Logo Too High
```javascript
logo: [0, 0.02, 0.16],  // Decrease Y value
```

### Logo Not Centered
```javascript
logo: [0, 0.05, 0.16],  // Set X to 0
```

### Back Decal Too Far Back
```javascript
back: [0, 0.05, -0.12],  // Less negative Z (closer to -0.10)
```

### Sleeve Too Close to Body
```javascript
leftSleeve: [-0.28, 0.05, 0.08],   // More negative X
rightSleeve: [0.28, 0.05, 0.08],   // More positive X
```

### Decal Floating/Clipping
```javascript
// Floating (too far from surface)
logo: [0, 0.05, 0.14],  // Reduce Z

// Clipping (inside surface)
logo: [0, 0.05, 0.18],  // Increase Z
```

---

## Advanced: Using Browser Console

### Enable Debug Logging

You can temporarily add console.log to see current positions:

**Edit `client/src/canvas/ModelViewer.jsx`** around line 108:

```javascript
useEffect(() => {
  if (meshNode) {
    const config = calculateDecalPositions(meshNode);

    // ADD THIS LINE TO SEE POSITIONS
    console.log('📍 Current decal positions:', config.positions);
    console.log('📐 Current decal scales:', config.scale);

    setDecalConfig(config);
    // ... rest of code
  }
}, [meshNode, snap.selectedModel]);
```

Then check browser console for position values.

---

## Scale Adjustments (FUTURE)

Currently, scale is auto-calculated. To add manual scale control, you would need to modify the code to accept scale values from `decalpositions.js`.

For now, focus on position adjustments only.

---

## Troubleshooting

### Decal Not Showing
- Check if the decal toggle is enabled (logoShirt, backShirt, etc.)
- Verify the image uploaded successfully
- Check browser console for errors

### Decal in Wrong Location
- Double-check you're editing the correct model path
- Ensure coordinates are in correct order: `[x, y, z]`
- Save the file and refresh browser

### Changes Not Applying
- Verify you saved `decalpositions.js`
- Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Check for syntax errors in the JavaScript file

### Decal Clipping Through Model
- Increase Z value slightly (move away from surface)
- Adjust by small increments: `0.01` to `0.02`

---

## Example: Complete Adjustment Process

Let's say the **AGC Jacket** logo appears too low and too far right:

### 1. Current Position
```javascript
"/models/agc_jacket.glb": {
    logo: [0, 0.05, 0.16],
    // ... other positions
},
```

### 2. Test in Browser
- Navigate to Customizer with AGC Jacket
- Upload logo
- Observe: Logo is low and right

### 3. Adjust Position
```javascript
"/models/agc_jacket.glb": {
    logo: [-0.02, 0.12, 0.16],  // Move left (-0.02) and up (0.12)
    // ... other positions
},
```

### 4. Save and Refresh
- Save file
- Refresh browser
- Check result

### 5. Fine-tune
```javascript
"/models/agc_jacket.glb": {
    logo: [-0.01, 0.10, 0.16],  // Slight adjustment
    // ... other positions
},
```

### 6. Final Result
- Logo now appears centered on chest at correct height

---

## Tips for Efficient Positioning

1. **Start with default values** from similar models
2. **Make small adjustments** (0.01 to 0.05 increments)
3. **Test one decal at a time** (logo first, then sleeves, etc.)
4. **Use symmetry** - if left sleeve is at `[-0.22, ...]`, right should be `[0.22, ...]`
5. **Document your changes** - add comments for specific models
6. **Keep backups** - copy working configurations before major changes

---

## Next Steps

1. Identify which models have incorrect decal positions
2. Test each model in Customizer
3. Adjust positions in `decalpositions.js`
4. Save and verify changes
5. Repeat for all models

---

## Need Help?

Common issues and solutions are in the Troubleshooting section above. For code-level changes or advanced customization, refer to:
- `client/src/canvas/ModelViewer.jsx` - Decal rendering
- `client/src/config/decalpositions.js` - Position configuration
- Browser DevTools Console - Real-time debugging
