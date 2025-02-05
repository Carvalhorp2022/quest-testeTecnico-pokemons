import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import PokemonCard from '../components/PokemonCard';
import { useTheme } from '../contexts/ThemeContext';

const lightTheme = {
  background: '#f0f0f0',
  color: '#1a1a1a',
};

const darkTheme = {
  background: '#1a1a1a',
  color: '#f0f0f0',
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.color};
  min-height: 100vh;
  transition: background 0.5s ease-in-out, color 0.5s ease-in-out;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  transition: transform 0.3s ease-in-out, color 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1);
    color: #007bff;
  }
`;

const SearchInput = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  max-width: 300px;
`;

const Select = styled.select`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  max-width: 320px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Card = styled.div`
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: ${(props) => (props.theme === 'dark' ? '#2c2c2c' : '#fff')};
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 600px) {
    padding: 10px;
  }
`;

const Home = () => {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [types, setTypes] = useState([]);
  const [offset, setOffset] = useState(0);
  const { theme, toggleTheme } = useTheme();

  const fetchPokemons = async (currentOffset = 0, initialLoad = false) => {
    const limit = 10;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${currentOffset}&limit=${limit}`);
    const data = await response.json();
    const detailedPokemons = await Promise.all(
      data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        return res.json();
      })
    );

    if (initialLoad) {
      setPokemons(detailedPokemons);
    } else {
      setPokemons((prev) => [...prev, ...detailedPokemons]);
    }
    setOffset(currentOffset + limit);
  };

  const fetchTypes = async () => {
    const response = await fetch('https://pokeapi.co/api/v2/type');
    const data = await response.json();
    setTypes(data.results);
  };

  useEffect(() => {
    fetchPokemons(0, true);
    fetchTypes();
  }, []);

  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesName = pokemon.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = type
      ? pokemon.types.some((t) => t.type.name === type)
      : true;
    return matchesName && matchesType;
  });

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <Container>
        <Title>Quest Pokémons</Title>
        <Button onClick={toggleTheme}>Alternar Tema</Button>
        <SearchInput
          type="text"
          placeholder="Pesquisar Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Todos os Tipos</option>
          {types.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
            </option>
          ))}
        </Select>
        <GridContainer>
          {filteredPokemons.map((pokemon) => (
            <Link to={`/pokemon/${pokemon.id}`} key={pokemon.id}>
              <Card>
                <PokemonCard pokemon={pokemon} />
              </Card>
            </Link>
          ))}
        </GridContainer>
        <Button onClick={() => fetchPokemons(offset)}>Carregar Mais</Button>
      </Container>
    </ThemeProvider>
  );
};

export default Home;














