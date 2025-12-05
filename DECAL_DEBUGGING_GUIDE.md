# Decal Debugging Guide - AGC Jacket & Other Models

## Issue: Decals Not Showing on AGC Jacket

This guide will help you debug and fix decal positioning issues for any model.

## Step 1: Open Browser Console

1. Open your browser
2. Navigate to the Customizer page with AGC Jacket selected
3. Press **F12** to open Developer Tools
4. Go to the **Console** tab

## Step 2: Check Console Logs

You should see these logs when the model loads:

```
🔍 Model loaded: /models/agc_jacket.glb
📦 Nodes: [...list of node names...]
🎨 Materials: [...list of material names...]
✅ Mesh found: [mesh name]
✅ Using MANUAL positions for: /models/agc_jacket.glb
📍 Manual config: {logo: Array(3), back: Array(3), ...}
⚙️ Final decal config: {positions: {...}, scale: {...}}
```

## Step 3: Identify the Problem

### Problem A: No Mesh Found
If you see:
```
❌ No mesh found in nodes!
```

**Solution:** The model has a different structure. Type this in console:
```javascript
// Get all nodes
const nodes = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.values().next().value.currentDispatcherRef.current

// OR manually inspect
console.log(nodes)
```

Look for nodes with `isMesh: true` and note the name.

### Problem B: Wrong Mesh Selected
The AGC jacket might have multiple meshes. Check the console log:
```
✅ Mesh found: Object_4
```

If it's selecting the wrong mesh, we need to update the ModelViewer.

### Problem C: Decals Are Positioned Incorrectly
The positions might be way off for this specific model.

## Step 4: Test Decal Positions Manually

### Method 1: Quick Test in Console

Open console and run:
```javascript
// Test if decals are rendering at all
console.log('Logo texture active:', state.isLogoTexture);
console.log('Logo decal value:', state.logoDecal);
```

### Method 2: Adjust Positions in Real-Time

1. Open `client/src/config/decalpositions.js`
2. Find the AGC Jacket section (line 47-55)
3. Try these test positions to see if decals appear ANYWHERE:

```javascript
// AGC Jacket - TEST POSITIONS
"/models/agc_jacket.glb": {
    logo: [0, 0, 0.5],        // Far forward
    back: [0, 0, -0.5],       // Far back
    leftSleeve: [-0.5, 0, 0], // Far left
    rightSleeve: [0.5, 0, 0], // Far right
    collar: [0, 0.5, 0],      // Far up
    tag: [0, -0.5, 0],        // Far down
    full: [0, 0, 0.5],        // Far forward
},
```

4. Save and refresh the browser
5. Try adding a logo or decal
6. If you see the decal ANYWHERE (even if misplaced), the system is working!

## Step 5: Fine-Tune Positions

Once you see decals appearing, adjust positions incrementally:

### Understanding Position Coordinates [x, y, z]:
- **x**: Negative = Left, Positive = Right
- **y**: Negative = Down, Positive = Up
- **z**: Negative = Back, Positive = Front

### Example Adjustment Process:

**If logo appears too high:**
```javascript
logo: [0, 0.05, 0.16]  // BEFORE
logo: [0, 0.02, 0.16]  // AFTER (moved down)
```

**If logo appears too far left:**
```javascript
logo: [0, 0.05, 0.16]   // BEFORE
logo: [0.03, 0.05, 0.16] // AFTER (moved right)
```

**If logo appears behind the model:**
```javascript
logo: [0, 0.05, 0.16]  // BEFORE
logo: [0, 0.05, 0.20]  // AFTER (moved forward)
```

## Step 6: Using Browser DevTools to Find Perfect Positions

### Advanced Method: Inspect 3D Scene

1. Install **React DevTools** Chrome extension
2. Open React DevTools > Components tab
3. Find `<ModelViewer>` component
4. Expand the mesh and Decal components
5. You can see the current position values in real-time

### Expert Method: Access Three.js Scene

In console, type:
```javascript
// Access the Three.js scene (if you have React DevTools)
// This lets you see the actual 3D positions

// Method 1: Log current decal positions
console.log('Current positions:', decalConfig.positions);

// Method 2: Try different positions on-the-fly
// (You'll need to modify the code to allow this)
```

## Step 7: Common AGC Jacket Issues

### Issue: Decals Not Visible at All

**Possible Causes:**
1. **Z-fighting**: Decal is exactly on the surface, causing flickering
   - **Fix**: Increase z-position slightly: `[0, 0.05, 0.17]`

2. **Inside the model**: Decal is positioned inside the mesh
   - **Fix**: Move decal forward (increase z): `[0, 0.05, 0.25]`

3. **Behind the model**: Decal is on the back when you expect front
   - **Fix**: Swap positive/negative z values

4. **Too small**: Decal scale is too tiny to see
   - **Fix**: In ModelViewer.jsx, increase scale:
   ```javascript
   scale: {
     logo: 0.35, // Increased from 0.25
     full: 1.0,  // Increased from 0.8
   }
   ```

### Issue: Decals Appear Distorted

**Cause**: The AGC jacket might have a complex geometry

**Fix**: Adjust rotation in ModelViewer.jsx:
```javascript
<Decal
  position={positions.logo}
  rotation={[0, 0, 0]}        // Try different rotations
  scale={scale.logo}
  map={logoTexture}
/>

// Try these rotations:
rotation={[Math.PI / 6, 0, 0]}  // Tilt up
rotation={[0, Math.PI / 4, 0]}  // Rotate sideways
```

## Step 8: Optimal AGC Jacket Positions

Based on typical jacket geometry, try these positions:

```javascript
"/models/agc_jacket.glb": {
    // Front chest - higher up on jacket
    logo: [0, 0.15, 0.18],

    // Back center - between shoulder blades
    back: [0, 0.15, -0.18],

    // Left sleeve - upper arm area
    leftSleeve: [-0.25, 0.10, 0.05],

    // Right sleeve - upper arm area
    rightSleeve: [0.25, 0.10, 0.05],

    // Collar - near neckline
    collar: [0, 0.25, 0.12],

    // Tag - lower back inside
    tag: [0, -0.10, -0.15],

    // Full design - center front
    full: [0, 0.15, 0.18],
},
```

## Step 9: Save Your Changes

Once you find the perfect positions:

1. Update `client/src/config/decalpositions.js`
2. Save the file
3. Test with different decals (logo, full, back, sleeves)
4. Document the positions in comments:

```javascript
"/models/agc_jacket.glb": {
    logo: [0, 0.15, 0.18],  // Front chest - tested with tiger logo ✓
    back: [0, 0.15, -0.18], // Back center - tested with text ✓
    // ... etc
},
```

## Step 10: Remove Debug Logs (Production)

Once everything works, remove the debug console logs from ModelViewer.jsx:

Remove these lines (15-18, 107-111, 123, 144):
```javascript
// Remove these:
console.log('🔍 Model loaded:', snap.selectedModel);
console.log('📦 Nodes:', Object.keys(nodes));
console.log('🎨 Materials:', Object.keys(materials));
console.log('✅ Mesh found:', ...);
console.log('❌ No mesh found in nodes!');
console.log('✅ Using MANUAL positions for:', ...);
console.log('📍 Manual config:', manualConfig);
console.log('⚙️ Final decal config:', config);
```

## Quick Reference: Position Adjustment

| Issue | Fix |
|-------|-----|
| Decal too high | Decrease y: `[0, 0.05 → 0.02, 0.16]` |
| Decal too low | Increase y: `[0, 0.05 → 0.10, 0.16]` |
| Decal too far left | Increase x: `[0 → 0.03, 0.05, 0.16]` |
| Decal too far right | Decrease x: `[0 → -0.03, 0.05, 0.16]` |
| Decal behind model | Increase z: `[0, 0.05, 0.16 → 0.20]` |
| Decal inside model | Increase z: `[0, 0.05, 0.16 → 0.25]` |
| Decal too small | Increase scale in ModelViewer.jsx |
| Decal too large | Decrease scale in ModelViewer.jsx |

## Testing Checklist

For each model, test:
- [ ] Logo decal (front chest)
- [ ] Full decal (entire front)
- [ ] Back decal
- [ ] Left sleeve decal
- [ ] Right sleeve decal
- [ ] With different images (logos, patterns, photos)
- [ ] With color changes
- [ ] Model rotation (check all angles)

## Need More Help?

If decals still don't appear after trying all the above:

1. Share the console logs (especially the Nodes and Materials output)
2. Check if the AGC Jacket model file is corrupted
3. Try loading the model in a 3D viewer (like Blender) to see its structure
4. Compare with a working model (like shirt_baked.glb)

## Pro Tip: Batch Testing

Create a test function in console to quickly try multiple positions:

```javascript
// Test multiple positions quickly
const testPositions = [
    [0, 0, 0.2],
    [0, 0.1, 0.2],
    [0, 0.2, 0.2],
    [0, 0.1, 0.3],
];

testPositions.forEach((pos, i) => {
    console.log(`Test ${i + 1}: [${pos}]`);
    // Update position and check result
});
```

Good luck debugging! The console logs added will make it much easier to identify the exact issue.
