import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Card = styled.div`
  background-color: #f0f8ff;
  border: 2px solid #000;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  text-align: center;
`;

const Description = styled.p`
  text-align: left;
  margin: 5px 0;
  width: 100%;
`;

const List = styled.ul`
  text-align: left;
  padding-left: 20px;
`;

const BackButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const PokemonDetail = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPokemon = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await res.json();

      const abilitiesDetails = await Promise.all(
        data.abilities.map(async (abilityInfo) => {
          const res = await fetch(abilityInfo.ability.url);
          return res.json();
        })
      );

      setPokemon({ ...data, abilitiesDetails });
    };

    fetchPokemon();
  }, [id]);

  if (!pokemon) return <DetailContainer>Carregando...</DetailContainer>;

  return (
    <DetailContainer>
      <Card>
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        <h1>{pokemon.name}</h1>
        <h2>Tipo:</h2>
        <List>
          {pokemon.types.map((type) => (
            <li key={type.type.name}>{type.type.name}</li>
          ))}
        </List>
        <h2>Movimentos:</h2>
        <List>
          {pokemon.moves.slice(0, 10).map((move) => (
            <li key={move.move.name}>{move.move.name}</li>
          ))}
        </List>
        <h2>Habilidades:</h2>
        <List>
          {pokemon.abilitiesDetails.map((ability) => (
            <li key={ability.name}>
              <strong>{ability.name}:</strong>
              <Description>{ability.effect_entries.find(e => e.language.name === 'en')?.effect || 'Descrição não disponível.'}</Description>
            </li>
          ))}
        </List>
        <BackButton onClick={() => navigate('/')}>Voltar para a Tela Inicial</BackButton>
      </Card>
    </DetailContainer>
  );
};

export default PokemonDetail;




