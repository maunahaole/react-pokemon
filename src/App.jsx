import axios from "axios";
import { useState } from "react";
import "./App.css";

const POKEMON_COUNT = 1351;

function PokemonCard({ pokemon, small }) {
  return (
    <div className={small ? "card card-small" : "card"}>
      <h2>Name: {pokemon.name}</h2>
      <h3>
        Type:{" "}
        {pokemon.types.map((t) => (
          <span key={t.slot} className="type-badge">
            {t.type.name}
          </span>
        ))}
      </h3>
      {pokemon.image ? (
        <img src={pokemon.image} alt={pokemon.name} width={small ? 96 : 200} />
      ) : (
        <p className="no-image">No image available</p>
      )}
    </div>
  );
}

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleGetRandomPokemon() {
    try {
      setError(null);
      setLoading(true);
      setSimilar([]); // clear the old similar list when fetching a new pokemon
      const randPokemonNum = Math.floor(Math.random() * POKEMON_COUNT) + 1;
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${randPokemonNum}`
      );

      setPokemon({
        name: response.data.name,
        image: response.data.sprites.front_default,
        types: response.data.types,
      });
    } catch (err) {
      console.log(err);
      setError("Could not fetch a Pokemon. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGetSimilar() {
    try {
      setError(null);
      setLoading(true);
      const typeUrl = pokemon.types[0].type.url;
      const typeResponse = await axios.get(typeUrl);
      const firstFive = typeResponse.data.pokemon.slice(0, 5);

      const detailResponses = await Promise.all(
        firstFive.map((entry) => axios.get(entry.pokemon.url))
      );

      const detailedPokemon = detailResponses.map((res) => ({
        name: res.data.name,
        image: res.data.sprites.front_default,
        types: res.data.types,
      }));

      setSimilar(detailedPokemon);
    } catch (err) {
      console.log(err);
      setError("Could not fetch similar Pokemon. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <h1>Learn all {POKEMON_COUNT} Pokemon!</h1>

      <button onClick={handleGetRandomPokemon} disabled={loading}>
        Get Random Pokemon
      </button>

      {loading && <p className="status">Loading…</p>}
      {error && <p className="error">{error}</p>}

      {pokemon && <PokemonCard pokemon={pokemon} />}

      {pokemon && (
        <button onClick={handleGetSimilar} disabled={loading}>
          Get 5 Similar Pokemon
        </button>
      )}

      <div className="similar-row">
        {similar.map((p) => (
          <PokemonCard key={p.name} pokemon={p} small />
        ))}
      </div>
    </div>
  );
}

export default App;
