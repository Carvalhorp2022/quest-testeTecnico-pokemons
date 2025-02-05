
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProviderComponent } from '../contexts/ThemeContext';

// Mock da API
jest.mock('../components/PokemonCard', () => ({ pokemon }) => (
  <div data-testid="pokemon-card">{pokemon.name}</div>
));

global.fetch = jest.fn((url) => {
  if (url.includes('pokemon/1')) {
    return Promise.resolve({
      json: () => Promise.resolve({ name: 'bulbasaur', id: 1, types: [], abilities: [], moves: [] }),
    });
  }
  if (url.includes('pokemon/4')) {
    return Promise.resolve({
      json: () => Promise.resolve({ name: 'charmander', id: 4, types: [], abilities: [], moves: [] }),
    });
  }

  return Promise.resolve({
    json: () =>
      Promise.resolve({
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
        ],
      }),
  });
});

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <ThemeProviderComponent>{ui}</ThemeProviderComponent>
    </BrowserRouter>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('deve renderizar o título "Quest Pokémons"', async () => {
    renderWithProviders(<Home />);
    await waitFor(() => expect(screen.getByText('Quest Pokémons')).toBeInTheDocument());
  });

  test('deve alternar o tema ao clicar no botão', async () => {
    renderWithProviders(<Home />);
    const button = screen.getByText('Alternar Tema');
    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });

  test('deve pesquisar Pokémon pelo nome', async () => {
    renderWithProviders(<Home />);

    await waitFor(() => expect(fetch).toHaveBeenCalled());

    const searchInput = screen.getByPlaceholderText('Pesquisar Pokémon...');
    fireEvent.change(searchInput, { target: { value: 'bulbasaur' } });

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.queryByText('charmander')).not.toBeInTheDocument();
  });

  test('deve carregar mais Pokémon ao clicar no botão', async () => {
    renderWithProviders(<Home />);

    await waitFor(() => expect(fetch).toHaveBeenCalled());

    const initialCalls = fetch.mock.calls.length;
    const loadMoreButton = screen.getByText('Carregar Mais');
    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(fetch.mock.calls.length).toBeGreaterThan(initialCalls);
    });
  });
});
