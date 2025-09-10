import { Heart } from "lucide-react";

interface HeaderProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const Header = ({ activeFilter, onFilterChange }: HeaderProps) => {
  const filters = [
    { key: 'todos', label: 'Todos' },
    { key: 'ebook', label: 'Ebooks' },
    { key: 'desenho', label: 'Desenhos' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Heart className="w-6 h-6 text-primary" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gradient-primary">
                Saúde Fácil
              </h1>
              <p className="text-sm text-muted-foreground">
                Sua biblioteca digital portátil
              </p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => onFilterChange(filter.key)}
                className={`btn-filter ${
                  activeFilter === filter.key 
                    ? 'btn-filter-active' 
                    : 'btn-filter-inactive'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};