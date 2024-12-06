import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Button } from 'react-native';
import axios from 'axios';

export default function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [offset, setOffset] = useState(0);

  // Função para buscar Pokémons
  const fetchPokemons = async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`);
      const pokemonData = await Promise.all(
        response.data.results.map(async (pokemon) => {
          const details = await axios.get(pokemon.url);
          return {
            name: pokemon.name,
            image: details.data.sprites.front_default,
          };
        })
      );
      setPokemonList((prev) => [...prev, ...pokemonData]);
      setOffset((prev) => prev + 10);
    } catch (error) {
      console.error('Erro ao buscar Pokémons:', error);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  // Função para favoritar/desfavoritar
  const toggleFavorite = (pokemon) => {
    if (favorites.some((fav) => fav.name === pokemon.name)) {
      setFavorites(favorites.filter((fav) => fav.name !== pokemon.name));
    } else {
      setFavorites([...favorites, pokemon]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔴 Meus favoritos 🔴</Text>
      <Text style={styles.subHeader}>{favorites.length}</Text>

      <FlatList
        data={pokemonList}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.pokemonCard}>
            <Image source={{ uri: item.image }} style={[styles.pokemonImage, favorites.some((fav) => fav.name === item.name) && styles.favorite]} />
            <Text style={styles.pokemonName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />

      <Button title="Carregar Mais Pokémons" onPress={fetchPokemons} color="#FFCC00" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  listContainer: {
    justifyContent: 'space-between',
  },
  pokemonCard: {
    alignItems: 'center',
    margin: 5,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: 150,
  },
  pokemonImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  favorite: {
    borderColor: 'gold',
    borderWidth: 3,
    borderRadius: 50,
  },
});
