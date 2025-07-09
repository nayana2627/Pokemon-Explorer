import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pokemon } from '@/types/pokemon';
import { pokemonApi } from '@/services/pokemonApi';
import { useNavigate } from 'react-router-dom';

interface PokemonCardProps {
  name: string;
  url: string;
}

const typeColors: Record<string, string> = {
  normal: 'bg-pokemon-normal',
  fire: 'bg-pokemon-fire text-white',
  water: 'bg-pokemon-water text-white',
  electric: 'bg-pokemon-electric',
  grass: 'bg-pokemon-grass text-white',
  ice: 'bg-pokemon-ice',
  fighting: 'bg-pokemon-fighting text-white',
  poison: 'bg-pokemon-poison text-white',
  ground: 'bg-pokemon-ground text-white',
  flying: 'bg-pokemon-flying text-white',
  psychic: 'bg-pokemon-psychic',
  bug: 'bg-pokemon-bug text-white',
  rock: 'bg-pokemon-rock text-white',
  ghost: 'bg-pokemon-ghost text-white',
  dragon: 'bg-pokemon-dragon text-white',
  dark: 'bg-pokemon-dark text-white',
  steel: 'bg-pokemon-steel text-white',
  fairy: 'bg-pokemon-fairy',
};

export const PokemonCard = ({ name, url }: PokemonCardProps) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const navigate = useNavigate();

  const pokemonId = url.split('/').filter(Boolean).pop();

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const data = await pokemonApi.getPokemon(name);
        setPokemon(data);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [name]);

  const handleClick = () => {
    if (pokemon) {
      navigate(`/pokemon/${pokemon.id}`);
    }
  };

  if (loading) {
    return (
      <Card className="cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-1 bg-gradient-card animate-pulse">
        <CardContent className="p-4 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-lg"></div>
          <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-3 bg-muted rounded w-1/2 mx-auto mb-2"></div>
          <div className="flex gap-1 justify-center">
            <div className="h-5 w-12 bg-muted rounded-full"></div>
            <div className="h-5 w-12 bg-muted rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!pokemon) return null;

  const imageUrl = pokemon.sprites.other['official-artwork'].front_default || 
                  pokemon.sprites.front_default || 
                  '/placeholder.svg';

  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:shadow-pokemon hover:-translate-y-2 hover:scale-105 bg-gradient-card group animate-slide-up"
      onClick={handleClick}
    >
      <CardContent className="p-6 text-center">
        <div className="relative mb-4">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-muted rounded-lg animate-pulse"></div>
            </div>
          )}
          <img
            src={imageUrl}
            alt={pokemon.name}
            className={`w-24 h-24 mx-auto object-contain transition-all duration-300 group-hover:animate-float ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        </div>
        
        <h3 className="text-lg font-bold capitalize mb-2 text-foreground group-hover:text-primary transition-colors">
          {pokemon.name}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-3">
          #{pokemon.id.toString().padStart(3, '0')}
        </p>
        
        <div className="flex gap-1 justify-center flex-wrap">
          {pokemon.types.map((type) => (
            <Badge
              key={type.type.name}
              variant="secondary"
              className={`text-xs px-2 py-1 transition-all duration-300 ${
                typeColors[type.type.name] || 'bg-muted'
              }`}
            >
              {type.type.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};