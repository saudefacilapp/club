import { ContentCard } from "./ContentCard";

interface Content {
  id: string;
  titulo: string;
  tipo: 'ebook' | 'desenho';
  url_capa: string;
  url_arquivo: string;
}

interface ContentGridProps {
  contents: Content[];
  isLoading: boolean;
  onRead: (id: string, titulo: string, url_arquivo: string) => void;
  onDownload: (url_arquivo: string, titulo: string) => void;
}

export const ContentGrid = ({ contents, isLoading, onRead, onDownload }: ContentGridProps) => {
  if (isLoading) {
    return (
      <div className="mobile-grid">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="card-health animate-pulse mobile-card">
            <div className="aspect-[3/4] bg-muted/50 rounded-t-2xl" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-muted/50 rounded" />
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="h-12 sm:h-10 bg-muted/50 rounded-lg flex-1" />
                <div className="h-12 sm:h-10 bg-muted/50 rounded-lg flex-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="text-2xl">📚</div>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Nenhum conteúdo encontrado
        </h3>
        <p className="text-muted-foreground">
          Tente ajustar os filtros ou volte mais tarde para ver novos conteúdos.
        </p>
      </div>
    );
  }

  return (
    <div className="mobile-grid">
      {contents.map((content) => (
        <ContentCard
          key={content.id}
          {...content}
          onRead={onRead}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
};