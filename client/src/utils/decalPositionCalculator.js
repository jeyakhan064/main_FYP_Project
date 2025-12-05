import * as THREE from 'three';
import { sleeveScaleMultipliers } from '../config/sleeveScales';
import state from '../store';

/**
 * Automatically calculates optimal decal positions for any model
 * by analyzing its geometry and bounding box
 */
export const calculateDecalPositions = (mesh) => {
  if (!mesh || !mesh.geometry) {
    console.error('Invalid mesh provided to calculateDecalPositions');
    return getDefaultPositions();
  }

  // Compute bounding box
  mesh.geometry.computeBoundingBox();
  const bbox = mesh.geometry.boundingBox;

  if (!bbox) {
    console.error('Could not compute bounding box');
    return getDefaultPositions();
  }

  // Get dimensions
  const width = bbox.max.x - bbox.min.x;
  const height = bbox.max.y - bbox.min.y;
  const depth = bbox.max.z - bbox.min.z;
  const center = new THREE.Vector3();
  bbox.getCenter(center);

  console.log('📏 Model Dimensions:', { width, height, depth });
  console.log('📍 Model Center:', center);

  // Calculate positions based on model geometry
  const positions = {
    // Logo - Front LEFT chest area (polo-style logo)
    logo: [
      center.x - width * 0.15,     // LEFT side (polo-style position)
      center.y + height * 0.25,    // Upper chest
      bbox.max.z + depth * 0.10    // Front surface with offset
    ],

    // Front - Center front (torso area)
    front: [
      center.x,
      center.y + height * 0.05,    // Slightly above center
      bbox.max.z + depth * 0.10
    ],

    // Back - Center back
    back: [
      center.x,
      center.y + height * 0.05,    // Slightly above center
      bbox.min.z - depth * 0.10    // Behind the model with offset
    ],

    // Left Sleeve - Covers ENTIRE left arm from shoulder to wrist
    leftSleeve: [
      bbox.min.x - width * 0.05,   // LEFT arm at shoulder edge
      center.y,                    // Mid-arm height (vertical center)
      center.z                     // Center depth (side view)
    ],

    // Right Sleeve - Covers ENTIRE right arm from shoulder to wrist
    rightSleeve: [
      bbox.max.x + width * 0.05,   // RIGHT arm at shoulder edge
      center.y,                    // Mid-arm height (vertical center)
      center.z                     // Center depth (side view)
    ],

    // Full - Covers entire front
    full: [
      center.x,
      center.y,
      bbox.max.z + depth * 0.08
    ],
  };

  // Calculate optimal scale based on model size
  const avgDimension = (width + height) / 2;
  const armLength = Math.abs(bbox.max.x - bbox.min.x) * 0.5; // Half the width for one arm

  // Get custom sleeve scale multiplier for this specific model
  const modelPath = state.selectedModel;
  const sleeveMultiplier = sleeveScaleMultipliers[modelPath] || sleeveScaleMultipliers.default;

  console.log(`🎯 Using sleeve multiplier ${sleeveMultiplier} for ${modelPath}`);

  const scale = {
    logo: avgDimension * 0.20,      // Small chest logo (square)
    front: avgDimension * 0.35,     // Medium front design
    back: avgDimension * 0.40,      // Larger back design
    leftSleeve: height * sleeveMultiplier,   // Custom scale per model
    rightSleeve: height * sleeveMultiplier,  // Custom scale per model
    full: width * 1.3,              // Maximum full coverage - uses width to cover arms fully
  };

  console.log('✅ Calculated decal positions:', positions);
  console.log('📐 Calculated decal scales:', scale);

  return { positions, scale };
};

/**
 * Default fallback positions (similar to shirt_baked)
 */
const getDefaultPositions = () => {
  return {
    positions: {
      logo: [0, 0.04, 0.15],
      front: [0, 0, 0.15],
      back: [0, 0, -0.15],
      leftSleeve: [0.15, 0, 0],
      rightSleeve: [-0.15, 0, 0],
      full: [0, 0, 0],
    },
    scale: {
      logo: 0.15,
      front: 0.2,
      back: 0.2,
      leftSleeve: 0.12,
      rightSleeve: 0.12,
      full: 1,
    }
  };
};

/**
 * Detects the best rotation for decals based on model orientation
 */
export const calculateDecalRotation = (position, modelCenter) => {
  // Front/Back rotation
  if (position[2] > modelCenter.z) {
    // Front
    return [0, 0, 0];
  } else if (position[2] < modelCenter.z) {
    // Back
    return [0, Math.PI, 0];
  }

  // Left/Right rotation
  if (position[0] > modelCenter.x) {
    // Left side
    return [0, Math.PI / 2, 0];
  } else if (position[0] < modelCenter.x) {
    // Right side
    return [0, -Math.PI / 2, 0];
  }

  return [0, 0, 0];
};

export default calculateDecalPositions;
