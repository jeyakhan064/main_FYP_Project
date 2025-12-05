import React, { useEffect } from "react";
import state from "../store";
import Canvas from "../canvas";
import Customizer from "./Customizer";
import Header from "../components/Header";

const CustomizerPage = () => {
  // Set intro to false when on customizer page (shows 3D view)
  useEffect(() => {
    state.intro = false;
  }, []);

  return (
    <main className="app transition-all ease-in relative">
      <Header />
      <div style={{ pointerEvents: 'none' }}>
        <Canvas />
      </div>
      <Customizer />
    </main>
  );
};

export default CustomizerPage;
