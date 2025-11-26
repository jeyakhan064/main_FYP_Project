import React, { useRef } from "react";
import { AccumulativeShadows, RandomizedLight } from "@react-three/drei";

const Backdrop = () => {
  const shadows = useRef();

  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={60}
      alphaTest={1}          // fully transparent plane
      scale={12}
      color="#ffffff"
      opacity={0.2}          // lighter, almost invisible
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.6, 0]} // pushed lower so no gray background overlaps
      blend={true}
    >
      {/* key light */}
      <RandomizedLight
        amount={4}
        radius={8}
        intensity={0.6}
        ambient={0.8}
        position={[5, 5, 2]}
        bias={0.001}
      />

      {/* fill light */}
      <RandomizedLight
        amount={4}
        radius={8}
        intensity={0.5}
        ambient={0.8}
        position={[-5, 5, -2]}
        bias={0.001}
      />
    </AccumulativeShadows>
  );
};

export default Backdrop;
