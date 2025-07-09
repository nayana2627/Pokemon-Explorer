import { Pokemon, PokemonListResponse } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const pokemonApi = {
  async getPokemonList(limit: number = 151, offset: number = 0): Promise<PokemonListResponse> {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon list');
    }
    return response.json();
  },

  async getPokemon(nameOrId: string | number): Promise<Pokemon> {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon: ${nameOrId}`);
    }
    return response.json();
  },

  async getPokemonById(id: number): Promise<Pokemon> {
    return this.getPokemon(id);
  },

  async getPokemonByName(name: string): Promise<Pokemon> {
    return this.getPokemon(name.toLowerCase());
  }
};