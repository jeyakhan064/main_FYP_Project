import { useSnapshot } from "valtio";
import state from "../store";
import Canvas from "../canvas";
import Customizer from "./Customizer";
import Explore from "../components/Explore";
import Header from "../components/Header";

const ExplorePage = () => {
  const snap = useSnapshot(state);

  return (
    <main className="app transition-all ease-in relative">
      <Header />

      {/* Show Explore only when intro is true */}
      {snap.intro ? (
        <Explore />
      ) : (
        <>
          {/* Show 3D Canvas and Customizer when user clicks an item */}
          <Canvas />
          <Customizer />
        </>
      )}
    </main>
  );
};

export default ExplorePage;
