import { BookOpen, Download, Palette } from "lucide-react";
import type React from 'react';

interface ContentCardProps {
  id: string;
  titulo: string;
  tipo: 'ebook' | 'desenho';
  url_capa: string;
  url_arquivo: string;
  onRead: (id: string, titulo: string, url_arquivo: string) => void;
  onDownload: (url_arquivo: string, titulo: string) => void;
}

export const ContentCard = ({ 
  id, 
  titulo, 
  tipo, 
  url_capa, 
  url_arquivo, 
  onRead, 
  onDownload 
}: ContentCardProps) => {
  const isEbook = tipo === 'ebook';

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = url_arquivo;
    link.download = `${titulo}.${isEbook ? 'pdf' : 'jpg'}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Also call the original download handler
    onDownload(url_arquivo, titulo);
  };

  return (
    <div className="card-health group fade-in mobile-card">
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted/30">
        <img
          src={url_capa}
          alt={titulo}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Type Badge */}
        <div className="absolute top-3 right-3">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium shadow-sm ${
            isEbook 
              ? 'bg-primary/90 text-primary-foreground border border-primary' 
              : 'bg-secondary/90 text-secondary-foreground border border-secondary'
          }`}>
            {isEbook ? (
              <BookOpen className="w-3 h-3" />
            ) : (
              <Palette className="w-3 h-3" />
            )}
            {isEbook ? 'Ebook' : 'Desenho'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg text-foreground leading-tight line-clamp-2 flex-1">
          {titulo}
        </h3>

        {/* Action Buttons - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onRead(id, titulo, url_arquivo)}
            className="mobile-button btn-action bg-primary text-primary-foreground hover:bg-primary/90 border-primary flex-1 flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            {isEbook ? 'Ler Online' : 'Ver Agora'}
          </button>
          
          <button
            onClick={handleDownload}
            className="mobile-button btn-action btn-download flex-1 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Baixar
          </button>
        </div>
      </div>
    </div>
  );
};