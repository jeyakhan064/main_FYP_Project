import { useSnapshot } from "valtio";
import state from "../store";
import Canvas from "../canvas";
import Home from "../components/Home";
import Customizer from "./Customizer";
import Header from "../components/Header";

const HomePage = () => {
  const snap = useSnapshot(state);

  return (
    <main className="app transition-all ease-in relative">
      <Header />

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
