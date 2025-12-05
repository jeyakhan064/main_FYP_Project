/**
 * Custom sleeve scale multipliers for different models
 *
 * Each model has different arm proportions, so we need custom scales
 * to ensure sleeves cover the entire arm from shoulder to wrist.
 *
 * Formula: sleeveScale = height * multiplier
 *
 * Tested values from user:
 * - AGC, Cloth, Indiana: 1.5 works best
 * - Hooded: 1.3 works best (1.5 is too much)
 * - Jean Jacket: 2.0 works best
 * - Varsity: 0.7-0.8 works best (higher values expand horizontally)
 * - T-Shirt: 0.5 works best
 * - Women's Top: 0.65 works best
 * - Hoodie: 1.2 works best
 */

export const sleeveScaleMultipliers = {
  // AGC Jacket - Perfect at 1.5
  "/models/agc_jacket.glb": 1.5,

  // Cloth Jacket - Perfect at 1.5
  "/models/cloth_jacket.glb": 1.5,

  // Indiana Jones Coat - Perfect at 1.5
  "/models/indiana_jones_wested_leather_coat.glb": 1.5,

  // Hooded Jacket - Perfect at 1.3 (1.5 is too much)
  "/models/hooded_jacket.glb": 1.3,

  // Jean Jacket - Perfect at 2.0
  "/models/jean_jacket.glb": 2.0,

  // Varsity Jacket - Perfect at 0.65 (prevents horizontal expansion)
  "/models/varsity_jacket.glb": 0.65,

  // T-Shirt - Perfect at 0.5
  "/models/shirt_baked.glb": 0.5,

  // Women's Top - Perfect at 0.65
  "/models/womens_top.glb": 0.65,

  // Hoodie - Perfect at 1.2
  "/models/hoodie.glb": 1.2,

  // Default fallback for any model not listed
  default: 1.2,
};
