import { Link } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import state from '../store';
import Canvas from '../canvas';
import Home from '../components/Home';
import Customizer from './Customizer';
import Header from '../components/Header';
const HomePage = () => {
  const snap = useSnapshot(state);

  return (
    <>
    <main className="app transition-all ease-in">
      <Header />
      <Home />
      <Canvas />
      <Customizer />
    </main>
    </>
  );
};

export default HomePage;
