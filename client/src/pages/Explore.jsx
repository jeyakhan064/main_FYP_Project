import React, { useEffect } from "react";
import state from "../store";
import Explore from "../components/Explore";
import Header from "../components/Header";

const ExplorePage = () => {
  // Reset intro to true when visiting explore page
  useEffect(() => {
    state.intro = true;
  }, []);

  return (
    <main className="app transition-all ease-in relative">
      <Header />
      <Explore />
    </main>
  );
};

export default ExplorePage;
