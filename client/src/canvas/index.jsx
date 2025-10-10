import { Canvas } from "@react-three/fiber";
import { Environment, Center, OrbitControls } from "@react-three/drei";

import Shirt from "./Shirt";
import Backdrop from "./Backdrop";

const CanvasModel = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 2.5], fov: 25 }} // move camera back a bit
      gl={{ preserveDrawingBuffer: true }}
      className="w-full max-w-full h-full transition-all ease-in"
    >
      <ambientLight intensity={0.5} />
      <Environment preset="city" />
      {/* <CameraRig> */}
      <Backdrop />
      <Center>
        <Shirt />
      </Center>
      {/* 👇 This makes the model rotatable with mouse */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        rotateSpeed={1}
        // if you want 360 rotation uncomment this
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        // minPolarAngle={Math.PI / 2}
        // maxPolarAngle={Math.PI / 2}
      />
      {/* </CameraRig> */}
    </Canvas>
  );
};

export default CanvasModel;
