import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Canvas from './canvas';
import Home from './pages/Home';
import Customizer from './pages/Customizer';
import Explore from './pages/Explore';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
      <main className="app transition-all ease-in">
        {/* Canvas stays globally rendered */}
        {/* <Canvas /> */}

        {/* Routes render one page component at a time */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
  );
}

export default App;
