import { useState, useEffect, useMemo } from 'react';
import { PokemonCard } from '@/components/PokemonCard';
import { PokemonSearch } from '@/components/PokemonSearch';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PokemonListItem, PokemonListResponse } from '@/types/pokemon';
import { pokemonApi } from '@/services/pokemonApi';

const Index = () => {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const data: PokemonListResponse = await pokemonApi.getPokemonList(151);
        setPokemon(data.results);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const filteredPokemon = useMemo(() => {
    if (!searchQuery) return pokemon;
    return pokemon.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [pokemon, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size={48} className="mb-4" />
          <p className="text-muted-foreground">Loading Pokemon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-bounce-in">
            Pokemon Explorer
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Discover and explore the world of Pokemon
          </p>
          <div className="max-w-md mx-auto">
            <PokemonSearch 
              onSearch={handleSearch}
              placeholder="Search Pokemon by name..."
            />
          </div>
        </div>
      </div>

      {/* Pokemon Grid */}
      <div className="container mx-auto px-4 py-12">
        {filteredPokemon.length === 0 && searchQuery ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No Pokemon Found</h2>
            <p className="text-muted-foreground">
              Try searching for a different Pokemon name
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {searchQuery ? `Search Results (${filteredPokemon.length})` : 'All Pokemon'}
              </h2>
              <p className="text-muted-foreground">
                Click on any Pokemon to see detailed information
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredPokemon.map((p) => (
                <PokemonCard 
                  key={p.name} 
                  name={p.name} 
                  url={p.url}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
