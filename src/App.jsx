import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProviderComponent } from './contexts/ThemeContext.jsx';
import Home from './pages/Home.jsx';
import PokemonDetail from './pages/PokemonDetail.jsx';

const App = () => {
  return (
    <ThemeProviderComponent>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
        </Routes>
      </Router>
    </ThemeProviderComponent>
  );
};

export default App;
