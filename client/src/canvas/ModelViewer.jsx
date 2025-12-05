import { useState, useEffect, useMemo } from "react";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

import state from "../store";
import { decalPositions } from "../config/decalpositions";
import { calculateDecalPositions } from "../utils/decalPositionCalculator";

const ModelViewer = () => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF(snap.selectedModel);

  // Debug: Log model structure
  console.log('🔍 Model loaded:', snap.selectedModel);
  console.log('📦 Nodes:', Object.keys(nodes));
  console.log('🎨 Materials:', Object.keys(materials));

  // Helper: Check if value is a color (hex) or image URL
  const isColor = (value) => value && typeof value === 'string' && value.startsWith('#');

  // Separate colors from image URLs
  const logoIsColor = isColor(snap.logoDecal);
  const fullIsColor = isColor(snap.fullDecal);
  const backIsColor = isColor(snap.backDecal);
  const leftSleeveIsColor = isColor(snap.leftSleeveDecal);
  const rightSleeveIsColor = isColor(snap.rightSleeveDecal);
  const collarIsColor = isColor(snap.collarDecal);

  // Load image textures ONLY (useTexture can't handle colors)
  // Pass empty string as fallback to avoid errors
  const logoTextureImg = useTexture(logoIsColor ? '/threejs.png' : (snap.logoDecal || '/threejs.png'));
  const fullTextureImg = useTexture(fullIsColor ? '/threejs.png' : (snap.fullDecal || '/threejs.png'));
  const backTextureImg = useTexture(backIsColor ? '/threejs.png' : (snap.backDecal || '/threejs.png'));
  const leftSleeveTextureImg = useTexture(leftSleeveIsColor ? '/threejs.png' : (snap.leftSleeveDecal || '/threejs.png'));
  const rightSleeveTextureImg = useTexture(rightSleeveIsColor ? '/threejs.png' : (snap.rightSleeveDecal || '/threejs.png'));
  const collarTextureImg = useTexture(collarIsColor ? '/threejs.png' : (snap.collarDecal || '/threejs.png'));

  // Create color textures from hex colors
  const logoTexture = useMemo(() => {
    if (logoIsColor) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = snap.logoDecal;
      ctx.fillRect(0, 0, 512, 512);
      return new THREE.CanvasTexture(canvas);
    }
    return logoTextureImg;
  }, [logoIsColor, snap.logoDecal, logoTextureImg]);

  const fullTexture = useMemo(() => {
    if (fullIsColor) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = snap.fullDecal;
      ctx.fillRect(0, 0, 512, 512);
      return new THREE.CanvasTexture(canvas);
    }
    return fullTextureImg;
  }, [fullIsColor, snap.fullDecal, fullTextureImg]);

  const backTexture = useMemo(() => {
    if (backIsColor) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = snap.backDecal;
      ctx.fillRect(0, 0, 512, 512);
      return new THREE.CanvasTexture(canvas);
    }
    return backTextureImg;
  }, [backIsColor, snap.backDecal, backTextureImg]);

  const leftSleeveTexture = useMemo(() => {
    if (leftSleeveIsColor) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = snap.leftSleeveDecal;
      ctx.fillRect(0, 0, 512, 512);
      return new THREE.CanvasTexture(canvas);
    }
    return leftSleeveTextureImg;
  }, [leftSleeveIsColor, snap.leftSleeveDecal, leftSleeveTextureImg]);

  const rightSleeveTexture = useMemo(() => {
    if (rightSleeveIsColor) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = snap.rightSleeveDecal;
      ctx.fillRect(0, 0, 512, 512);
      return new THREE.CanvasTexture(canvas);
    }
    return rightSleeveTextureImg;
  }, [rightSleeveIsColor, snap.rightSleeveDecal, rightSleeveTextureImg]);

  const collarTexture = useMemo(() => {
    if (collarIsColor) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = snap.collarDecal;
      ctx.fillRect(0, 0, 512, 512);
      return new THREE.CanvasTexture(canvas);
    }
    return collarTextureImg;
  }, [collarIsColor, snap.collarDecal, collarTextureImg]);

  // Get the first mesh node (assuming single-mesh models)
  const meshNode = Object.values(nodes).find((node) => node.isMesh);

  if (meshNode) {
    console.log('✅ Mesh found:', Object.keys(nodes).find(key => nodes[key] === meshNode));
  } else {
    console.error('❌ No mesh found in nodes!');
  }

  // Calculate decal positions and model scale automatically
  const [decalConfig, setDecalConfig] = useState(null);
  const [modelScale, setModelScale] = useState(1);

  useEffect(() => {
    if (meshNode) {
      // HYBRID MODE: Check if manual positions exist, otherwise use automatic calculation
      const manualConfig = decalPositions[snap.selectedModel];
      let config;

      if (manualConfig) {
        // Use MANUAL positions from config file
        console.log('✅ Using MANUAL positions for:', snap.selectedModel);
        console.log('📍 Manual config:', manualConfig);

        // Check if config has nested structure (new format) or flat structure (old format)
        if (manualConfig.positions && manualConfig.scale) {
          // New format with nested positions and scale objects
          config = manualConfig;
        } else {
          // Old format - create nested structure
          config = {
            positions: {
              logo: manualConfig.logo,
              front: manualConfig.logo,
              back: manualConfig.back,
              leftSleeve: manualConfig.leftSleeve,
              rightSleeve: manualConfig.rightSleeve,
              collar: manualConfig.collar,
              tag: manualConfig.tag,
              full: manualConfig.full,
            },
            scale: {
              logo: 0.15,           // Small chest logo (ORIGINAL working size)
              front: 0.25,          // Medium for front center designs
              back: 0.30,           // Larger for back center designs
              leftSleeve: 0.45,     // Large to cover entire sleeve (ORIGINAL working size)
              rightSleeve: 0.45,    // Large to cover entire sleeve (ORIGINAL working size)
              collar: 0.35,         // Collar/hood area
              tag: 0.1,             // Small tag
              full: 1.0,            // Maximum for full coverage
            }
          };
        }
      } else {
        // Use AUTOMATIC calculation based on geometry
        console.log('🤖 Using AUTOMATIC calculation for:', snap.selectedModel);
        config = calculateDecalPositions(meshNode);
      }

      console.log('⚙️ Final decal config:', config);
      setDecalConfig(config);

      // Auto-scale model to fit viewport consistently
      const bbox = new THREE.Box3().setFromObject(new THREE.Mesh(meshNode.geometry));
      const size = new THREE.Vector3();
      bbox.getSize(size);
      const maxDimension = Math.max(size.x, size.y, size.z);

      // Target size: normalize all models to similar visual size (increased for better visibility)
      const targetSize = 5.5;  // Increased from 3.2 to 4.0 (25% larger)
      const scale = targetSize / maxDimension;
      setModelScale(scale);
    }
  }, [meshNode, snap.selectedModel]);

  // Smooth color transitions
  useFrame((state, delta) => {
    if (materials && Object.values(materials)[0]) {
      const material = Object.values(materials)[0];
      if (material.color) {
        easing.dampC(material.color, snap.color, 0.25, delta);
      }
    }
  });

  // Re-render on state change
  const stateString = JSON.stringify(snap);

  if (!meshNode) {
    console.error("No mesh found in model!");
    return null;
  }

  if (!decalConfig) {
    return null; // Wait for positions to be calculated
  }

  const { positions, scale } = decalConfig;

  // Position adjustments for specific models that need vertical alignment
  const getPositionAdjustment = () => {
    const modelPath = snap.selectedModel;

    // Pants need upward adjustment
    if (modelPath.includes('the_pants')) {
      return [0, 3.5, 0];
    }

    // T-shirt, Women's Top, and Varsity Jacket need slight upward adjustment
    if (modelPath.includes('shirt_baked') ||
      modelPath.includes('womens_top') ||
      modelPath.includes('varsity_jacket')) {
      return [0, 0.15, 0];
    }

    // All other models stay at original position
    return [0, 0, 0];
  };

  const positionAdjustment = getPositionAdjustment();

  console.log('🎯 Decal states:', {
    isLogoTexture: snap.isLogoTexture,
    isFullTexture: snap.isFullTexture,
    isBackTexture: snap.isBackTexture,
    isLeftSleeveTexture: snap.isLeftSleeveTexture,
    isRightSleeveTexture: snap.isRightSleeveTexture,
    logoDecal: snap.logoDecal ? 'SET' : 'EMPTY',
    fullDecal: snap.fullDecal ? 'SET' : 'EMPTY',
    backDecal: snap.backDecal ? 'SET' : 'EMPTY',
  });
  console.log('📍 Using positions:', positions);
  console.log('📏 Using scale:', scale);
  console.log('🔍 Textures loaded:', {
    logoTexture: logoTexture ? 'LOADED' : 'NULL',
    fullTexture: fullTexture ? 'LOADED' : 'NULL',
    backTexture: backTexture ? 'LOADED' : 'NULL',
    leftSleeveTexture: leftSleeveTexture ? 'LOADED' : 'NULL',
    rightSleeveTexture: rightSleeveTexture ? 'LOADED' : 'NULL',
  });

  return (
    <group key={stateString} scale={modelScale} position={positionAdjustment}>
      <mesh
        geometry={meshNode.geometry}
        material={Object.values(materials)[0]}
        material-roughness={1}
        dispose={null}
      >
        {/* Logo Decal - Front chest */}
        {snap.isLogoTexture && (
          <>
            {console.log('🏷️ RENDERING LOGO:', {
              position: positions.logo,
              scale: scale.logo,
              texture: logoTexture ? 'EXISTS' : 'NULL',
              logoDecal: snap.logoDecal
            })}
            <Decal
              position={positions.logo}
              rotation={[0, 0, 0]}
              scale={[scale.logo, scale.logo, scale.logo]}
              map={logoTexture}
              depthTest={true}
              depthWrite={true}
            />
          </>
        )}

        {/* Back Decal - Center back */}
        {snap.isBackTexture && (
          <Decal
            position={positions.back}
            rotation={[0, Math.PI, 0]}
            scale={scale.back}
            map={backTexture}
            depthTest={true}
            depthWrite={true}
          />
        )}

        {/* Left Sleeve Decal */}
        {snap.isLeftSleeveTexture && (
          <Decal
            position={positions.leftSleeve}
            rotation={[0, Math.PI / 2, 0]}
            scale={[scale.leftSleeve * 0.4, scale.leftSleeve, scale.leftSleeve]}
            map={leftSleeveTexture}
            depthTest={true}
            depthWrite={true}
          />
        )}

        {/* Right Sleeve Decal */}
        {snap.isRightSleeveTexture && (
          <Decal
            position={positions.rightSleeve}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[scale.rightSleeve * 0.4, scale.rightSleeve, scale.rightSleeve]}
            map={rightSleeveTexture}
            depthTest={true}
            depthWrite={true}
          />
        )}

        {/* Full Texture - Covers entire garment (Belt area for pants) */}
        {snap.isFullTexture && (
          <Decal
            position={positions.full}
            rotation={[0, 0, 0]}
            scale={scale.full}
            map={fullTexture}
            depthTest={true}
            depthWrite={true}
          />
        )}

        {/* Collar Decal - Full coverage for pants */}
        {snap.isCollarTexture && (
          <Decal
            position={positions.collar}
            rotation={[0, 0, 0]}
            scale={scale.collar}
            map={collarTexture}
            depthTest={true}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  );
};

export default ModelViewer;
