import { useEffect } from "react";
import { useSnapshot } from "valtio";
import state from "../store";
import Canvas from "../canvas";
import Home from "../components/Home";
import Customizer from "./Customizer";

const HomePage = () => {
  const snap = useSnapshot(state);

  // Reset intro to true when visiting home page
  useEffect(() => {
    state.intro = true;
  }, []);

  return (
    <main className="app transition-all ease-in relative">
      {/* Show Home only when intro is true */}
      {snap.intro ? (
        <Home />
      ) : (
        <>
          {/* Show 3D Canvas and Customizer only after "Let's Do It" */}
          <Canvas />
          <Customizer />
        </>
      )}
    </main>
  );
};

export default HomePage;
