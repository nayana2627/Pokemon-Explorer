import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface PokemonSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const PokemonSearch = ({ onSearch, placeholder = "Search Pokemon..." }: PokemonSearchProps) => {
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative max-w-md mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
  className="pl-10 bg-card border-border focus:ring-primary focus:border-primary transition-all duration-300 text-foreground"
      />
    </div>
  );
};