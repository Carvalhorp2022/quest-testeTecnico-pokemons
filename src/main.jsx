import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProviderComponent } from './contexts/ThemeContext';

const basename = import.meta.env.MODE === 'production' ? '/quest-testeTecnico-pokemons' : '/';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <ThemeProviderComponent>
        <App />
      </ThemeProviderComponent>
    </BrowserRouter>
  </React.StrictMode>
);




