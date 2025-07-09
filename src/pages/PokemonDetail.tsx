import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Weight, Ruler } from 'lucide-react';
import { Pokemon } from '@/types/pokemon';
import { pokemonApi } from '@/services/pokemonApi';
import { LoadingSpinner } from '@/components/LoadingSpinner';

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

const statNames: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Attack',
  'special-defense': 'Sp. Defense',
  speed: 'Speed',
};

export default function PokemonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      if (!id) return;
      
      try {
        const data = await pokemonApi.getPokemonById(parseInt(id));
        setPokemon(data);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

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

  if (!pokemon) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Pokemon not found</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const imageUrl = pokemon.sprites.other['official-artwork'].front_default || 
                  pokemon.sprites.front_default || 
                  '/placeholder.svg';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Pokemon List
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pokemon Image and Basic Info */}
          <Card className="bg-gradient-card shadow-pokemon">
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 bg-muted rounded-lg animate-pulse"></div>
                  </div>
                )}
                <img
                  src={imageUrl}
                  alt={pokemon.name}
                  className={`w-48 h-48 mx-auto object-contain animate-float transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              </div>
              
              <h1 className="text-3xl font-bold capitalize mb-2 text-foreground">
                {pokemon.name}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-4">
                #{pokemon.id.toString().padStart(3, '0')}
              </p>
              
              <div className="flex gap-2 justify-center flex-wrap mb-6">
                {pokemon.types.map((type) => (
                  <Badge
                    key={type.type.name}
                    variant="secondary"
                    className={`text-sm px-3 py-1 ${
                      typeColors[type.type.name] || 'bg-muted'
                    }`}
                  >
                    {type.type.name}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-center gap-2 p-3 bg-muted rounded-lg">
                  <Weight className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-semibold">{pokemon.weight / 10} kg</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 p-3 bg-muted rounded-lg">
                  <Ruler className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Height</p>
                    <p className="font-semibold">{pokemon.height / 10} m</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Base Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        {statNames[stat.stat.name] || stat.stat.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {stat.base_stat}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min((stat.base_stat / 150) * 100, 100)} 
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Abilities */}
            <Card>
              <CardHeader>
                <CardTitle>Abilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pokemon.abilities.map((ability) => (
                    <div
                      key={ability.ability.name}
                      className="flex justify-between items-center p-2 bg-muted rounded-lg"
                    >
                      <span className="capitalize font-medium">
                        {ability.ability.name.replace('-', ' ')}
                      </span>
                      {ability.is_hidden && (
                        <Badge variant="outline" className="text-xs">
                          Hidden
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Moves (First 10) */}
            <Card>
              <CardHeader>
                <CardTitle>Sample Moves</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {pokemon.moves.slice(0, 10).map((move) => (
                    <div
                      key={move.move.name}
                      className="p-2 bg-muted rounded text-sm text-center capitalize"
                    >
                      {move.move.name.replace('-', ' ')}
                    </div>
                  ))}
                </div>
                {pokemon.moves.length > 10 && (
                  <p className="text-sm text-muted-foreground mt-3 text-center">
                    +{pokemon.moves.length - 10} more moves
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}