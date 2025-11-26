import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import ModelViewer from "./ModelViewer"; // ✅ universal viewer

const CanvasModel = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 45 }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full max-w-full h-full transition-all ease-in"
    >
      {/* ✨ Flat white background */}
      <color attach="background" args={["#ffffff"]} />

      {/* 🌤 Ambient + Hemisphere lighting for soft global light */}
      <hemisphereLight intensity={1.2} skyColor="#ffffff" groundColor="#ffffff" />

      {/* 💡 Key Lights - No shadows */}
      <directionalLight position={[2, 2, 2]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-2, 2, 2]} intensity={0.9} color="#ffffff" />
      <directionalLight position={[0, 0, -2]} intensity={0.9} color="#ffffff" />

      {/* 👕 Main 3D model (dynamic via selectedModel) with auto-scaling */}
      <Center scale={1}>
        <ModelViewer />
      </Center>

      {/* 🌀 Mouse controls - Rotation only (no zoom, no pan) */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.8}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
        minAzimuthAngle={-Infinity}
        maxAzimuthAngle={Infinity}
        makeDefault
      />

    </Canvas>
  );
};

export default CanvasModel;
