import * as THREE from 'three';

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
    // Logo - Front chest area (upper front, slightly right of center)
    logo: [
      center.x + width * 0.1,  // Slightly right
      center.y + height * 0.2,  // Upper chest
      bbox.max.z + depth * 0.05 // Offset to prevent z-fighting
    ],

    // Front - Center front (torso area)
    front: [
      center.x,
      center.y,
      bbox.max.z + depth * 0.05
    ],

    // Back - Center back
    back: [
      center.x,
      center.y,
      bbox.min.z - depth * 0.05 // Behind the model
    ],

    // Left Sleeve - Upper left arm area
    leftSleeve: [
      bbox.max.x + depth * 0.05,  // Left side with offset
      center.y + height * 0.15,    // Upper arm height
      center.z                      // Middle depth
    ],

    // Right Sleeve - Upper right arm area
    rightSleeve: [
      bbox.min.x - depth * 0.05,  // Right side with offset
      center.y + height * 0.15,    // Upper arm height
      center.z                      // Middle depth
    ],

    // Full - Covers entire front
    full: [
      center.x,
      center.y,
      bbox.max.z + depth * 0.03
    ],
  };

  // Calculate optimal scale based on model size
  const avgDimension = (width + height) / 2;
  const scale = {
    logo: avgDimension * 0.35,      // Increased from 0.15 to 0.35 for visibility
    front: avgDimension * 0.25,     // Medium front design
    back: avgDimension * 0.25,      // Medium back design
    leftSleeve: avgDimension * 0.28, // Increased from 0.12 to 0.28 for visibility
    rightSleeve: avgDimension * 0.28, // Increased from 0.12 to 0.28 for visibility
    full: avgDimension * 0.8,       // Large full texture
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
