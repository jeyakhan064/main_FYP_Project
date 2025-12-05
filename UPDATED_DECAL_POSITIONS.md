# Updated Decal Positions - All Models

## Changes Made

All models have been updated with new decal positioning strategy:

### Positioning Strategy

1. **Logo**: Front left top corner (polo-style positioning)
   - Position: `[-0.08 to -0.14, 0.12 to 0.20, 0.15 to 0.18]`
   - Scale: `0.15` (smaller for chest logo)
   - Like: Polo Ralph Lauren, Lacoste, Nike swoosh

2. **Left Sleeve**: Covers entire left sleeve area
   - Position: `[-0.18 to -0.32, varies, 0]` (centered on sleeve)
   - Scale: `0.45` (large to cover sleeve)
   - Rotation: `90°` to face forward

3. **Right Sleeve**: Covers entire right sleeve area
   - Position: `[0.18 to 0.32, varies, 0]` (centered on sleeve)
   - Scale: `0.45` (large to cover sleeve)
   - Rotation: `-90°` to face forward

4. **Back**: Center of back (UNCHANGED - was already correct)
   - Position: `[0, varies, negative Z]`
   - Scale: `0.30` (larger for back visibility)
   - Rotation: `180°`

5. **Full**: Covers entire front geometry
   - Position: `[0, varies, positive Z]`
   - Scale: `1.0` (maximum coverage)

## Scale Configuration

```javascript
scale: {
  logo: 0.15,           // Smaller for left chest logo
  front: 0.25,          // Medium for front center designs
  back: 0.30,           // Larger for back center designs
  leftSleeve: 0.45,     // Large to cover entire left sleeve
  rightSleeve: 0.45,    // Large to cover entire right sleeve
  full: 1.0,            // Maximum for full coverage
}
```

## Models Updated

### T-Shirts
- ✅ `/models/shirt_baked.glb` - Default t-shirt

### Tops
- ✅ `/models/womens_top.glb` - Women's oversized sweater

### Hoodies & Sweatshirts
- ✅ `/models/hoodie.glb` - Standard hoodie

### Jackets
- ✅ `/models/agc_jacket.glb` - AGC Jacket
- ✅ `/models/cloth_jacket.glb` - Cloth Jacket
- ✅ `/models/hooded_jacket.glb` - Hooded Jacket
- ✅ `/models/jean_jacket.glb` - Denim Jacket
- ✅ `/models/varsity_jacket.glb` - Varsity Jacket
- ✅ `/models/leather_jacket.glb` - Leather Jacket
- ✅ `/models/low_poly_tactical_jacket.glb` - Tactical Jacket

### Coats
- ✅ `/models/indiana_jones_wested_leather_coat.glb` - Long leather coat
- ✅ `/models/puffer_jacket(0.3).glb` - Puffer jacket

### Other
- ✅ `/models/a_jacket_with_a_skirt.glb` - Jacket with skirt combo
- ✅ `/models/the_pants.glb` - Pants (legs instead of sleeves)

## How to Test

1. Open any model in Customizer
2. Upload an image via File picker
3. Test each decal type:
   - **Logo**: Should appear on front left chest
   - **Left Sleeve**: Should cover left sleeve
   - **Right Sleeve**: Should cover right sleeve
   - **Back**: Should appear centered on back
   - **Full**: Should cover entire front

## Fine-Tuning Process

Now that base positions are set, you can fine-tune per model:

### To Move a Decal:

**Example**: Move AGC Jacket logo more to the right

1. Open `client/src/config/decalpositions.js`
2. Find AGC Jacket section (line 47)
3. Current logo position: `[-0.12, 0.18, 0.16]`
4. Adjust x-coordinate: `[-0.12 → -0.10, 0.18, 0.16]` (moves right)
5. Save and refresh browser

### Adjustment Reference:

| Want to... | Change... | Example |
|------------|-----------|---------|
| Move logo LEFT | Decrease X (more negative) | `-0.12` → `-0.14` |
| Move logo RIGHT | Increase X (less negative) | `-0.12` → `-0.10` |
| Move logo UP | Increase Y | `0.18` → `0.20` |
| Move logo DOWN | Decrease Y | `0.18` → `0.16` |
| Move logo FORWARD | Increase Z | `0.16` → `0.18` |
| Move logo BACK | Decrease Z | `0.16` → `0.14` |

### For Sleeves:

| Want to... | Change... | Example |
|------------|-----------|---------|
| Move sleeve UP | Increase Y | `0.05` → `0.08` |
| Move sleeve DOWN | Decrease Y | `0.05` → `0.02` |
| Move sleeve OUT | Increase magnitude | `-0.25` → `-0.28` (left) / `0.25` → `0.28` (right) |
| Move sleeve IN | Decrease magnitude | `-0.25` → `-0.22` (left) / `0.25` → `0.22` (right) |

## Color Picker Status

✅ **Color picker is working correctly**
- Changes base model color only
- No conflicts with decals
- Located in: `client/src/components/ColorPicker.jsx`

## Next Steps

1. Test each model with different decals
2. Note which models need position adjustments
3. Tell me specific adjustments needed (e.g., "AGC Jacket logo needs to move right")
4. I'll update positions based on your feedback

## Debug Logs Active

Console logs are currently active to help with positioning:
- `🔍 Model loaded`
- `📦 Nodes`
- `🎨 Materials`
- `✅ Mesh found`
- `📍 Using positions`
- `📏 Using scale`
- `🎯 Decal states`

These can be removed once positioning is finalized.
