import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  border: 1px solid ${(props) => props.theme.text};
  padding: 10px;
  margin: 10px 0;
  text-align: center;
  cursor: pointer;
`;

const PokemonCard = ({ pokemon }) => (
  <Card>
    <img src={pokemon.sprites.front_default} alt={pokemon.name} />
    <h3>{pokemon.name}</h3>
  </Card>
);

export default PokemonCard;
