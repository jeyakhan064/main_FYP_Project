import { useState, useEffect, useMemo } from "react";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

import state from "../store";
import { decalPositions } from "../config/decalpositions";

const ModelViewer = () => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF(snap.selectedModel);

  // Helper: Check if value is a color (hex) or image URL
  const isColor = (value) => value && typeof value === 'string' && value.startsWith('#');

  // Separate colors from image URLs
  const logoIsColor = isColor(snap.logoDecal);
  const fullIsColor = isColor(snap.fullDecal);
  const backIsColor = isColor(snap.backDecal);
  const leftSleeveIsColor = isColor(snap.leftSleeveDecal);
  const rightSleeveIsColor = isColor(snap.rightSleeveDecal);

  // Load image textures ONLY (useTexture can't handle colors)
  // Pass empty string as fallback to avoid errors
  const logoTextureImg = useTexture(logoIsColor ? '/threejs.png' : (snap.logoDecal || '/threejs.png'));
  const fullTextureImg = useTexture(fullIsColor ? '/threejs.png' : (snap.fullDecal || '/threejs.png'));
  const backTextureImg = useTexture(backIsColor ? '/threejs.png' : (snap.backDecal || '/threejs.png'));
  const leftSleeveTextureImg = useTexture(leftSleeveIsColor ? '/threejs.png' : (snap.leftSleeveDecal || '/threejs.png'));
  const rightSleeveTextureImg = useTexture(rightSleeveIsColor ? '/threejs.png' : (snap.rightSleeveDecal || '/threejs.png'));

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

  // Get the first mesh node (assuming single-mesh models)
  const meshNode = Object.values(nodes).find((node) => node.isMesh);

  // Calculate decal positions and model scale automatically
  const [decalConfig, setDecalConfig] = useState(null);
  const [modelScale, setModelScale] = useState(1);

  useEffect(() => {
    if (meshNode) {
      // Use manual positions from config file
      const manualConfig = decalPositions[snap.selectedModel] || decalPositions.default;

      console.log('✅ Using MANUAL positions for:', snap.selectedModel);
      console.log('📍 Manual positions:', manualConfig);

      const config = {
        positions: {
          logo: manualConfig.logo || [0, 0.04, 0.15],
          front: manualConfig.logo || [0, 0, 0.15],
          back: manualConfig.back || [0, 0.04, -0.15],
          leftSleeve: manualConfig.leftSleeve || [-0.18, 0.04, 0.08],
          rightSleeve: manualConfig.rightSleeve || [0.18, 0.04, 0.08],
          full: manualConfig.full || [0, 0.04, 0.15],
        },
        scale: {
          logo: 0.25,
          front: 0.25,
          back: 0.25,
          leftSleeve: 0.25,
          rightSleeve: 0.25,
          full: 0.8,
        }
      };

      setDecalConfig(config);

      // Auto-scale model to fit viewport consistently
      const bbox = new THREE.Box3().setFromObject(new THREE.Mesh(meshNode.geometry));
      const size = new THREE.Vector3();
      bbox.getSize(size);
      const maxDimension = Math.max(size.x, size.y, size.z);

      // Target size: normalize all models to similar visual size (increased slightly)
      const targetSize = 3.2;
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

  // Fix pants positioning - pants are lower-body garments and need vertical adjustment
  const isPantsModel = snap.selectedModel.includes('the_pants');
  const positionAdjustment = isPantsModel ? [0, 1.5, 0] : [0, 0, 0];

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
          <Decal
            position={positions.logo}
            rotation={[0, 0, 0]}
            scale={scale.logo}
            map={logoTexture}
            depthTest={true}
            depthWrite={true}
          />
        )}

        {/* Front Decal - Center front (alternative to logo) */}
        {snap.isFullTexture && !snap.isLogoTexture && (
          <Decal
            position={positions.front}
            rotation={[0, 0, 0]}
            scale={scale.front}
            map={fullTexture}
            depthTest={true}
            depthWrite={true}
          />
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
            scale={scale.leftSleeve}
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
            scale={scale.rightSleeve}
            map={rightSleeveTexture}
            depthTest={true}
            depthWrite={true}
          />
        )}

        {/* Full Texture - Covers entire garment */}
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
      </mesh>
    </group>
  );
};

export default ModelViewer;
