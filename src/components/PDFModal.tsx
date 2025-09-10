import { useState, useEffect, useRef } from "react";
import { X, Download, Maximize, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfUrl: string;
}

export const PDFModal = ({ isOpen, onClose, title, pdfUrl }: PDFModalProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [viewMode, setViewMode] = useState<'iframe' | 'external'>('iframe');
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Construct PDF URL with page parameter for supporting viewers
  const getPdfUrl = (page: number) => {
    return `${pdfUrl}#page=${page}`;
  };

  const handlePrevPage = () => {
    if (isTransitioning || currentPage <= 1) return;
    
    setIsTransitioning(true);
    
    // Animate out current page
    if (iframeRef.current) {
      iframeRef.current.style.transform = 'translateX(-100%)';
      iframeRef.current.style.opacity = '0';
    }
    
    setTimeout(() => {
      setCurrentPage(prev => prev - 1);
      
      // Animate in new page from right
      if (iframeRef.current) {
        iframeRef.current.style.transform = 'translateX(100%)';
        iframeRef.current.style.opacity = '0';
        
        // Trigger reflow then animate
        setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.style.transform = 'translateX(0)';
            iframeRef.current.style.opacity = '1';
          }
          setIsTransitioning(false);
        }, 50);
      }
    }, 300);
  };

  const handleNextPage = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Animate out current page
    if (iframeRef.current) {
      iframeRef.current.style.transform = 'translateX(100%)';
      iframeRef.current.style.opacity = '0';
    }
    
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      
      // Animate in new page from left
      if (iframeRef.current) {
        iframeRef.current.style.transform = 'translateX(-100%)';
        iframeRef.current.style.opacity = '0';
        
        // Trigger reflow then animate
        setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.style.transform = 'translateX(0)';
            iframeRef.current.style.opacity = '1';
          }
          setIsTransitioning(false);
        }, 50);
      }
    }, 300);
  };

  const toggleFullscreen = async () => {
    const el = containerRef.current || document.documentElement;
    if (!document.fullscreenElement) {
      await el.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const handleDownload = () => {
    window.open(pdfUrl, '_blank');
  };

  const openInNewTab = () => {
    window.open(pdfUrl, '_blank');
  };

  const switchToExternalView = () => {
    setViewMode('external');
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Exit fullscreen when modal closes
  useEffect(() => {
    if (!isOpen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPage();
      } else if (e.key === 'ArrowRight') {
        handleNextPage();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isOpen, onClose, currentPage, isTransitioning]);

  // Reset iframe styles when page changes
  useEffect(() => {
    if (iframeRef.current && !isTransitioning) {
      iframeRef.current.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
      iframeRef.current.style.transform = 'translateX(0)';
      iframeRef.current.style.opacity = '1';
    }
  }, [currentPage, isTransitioning]);

  if (!isOpen) return null;

  if (viewMode === 'external') {
    return (
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
        onClick={onClose}
      >
        <div 
          className="bg-background rounded-lg shadow-xl w-full max-w-md p-6 animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center">
              <div className="text-4xl">📄</div>
            </div>
            
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                {title}
              </h3>
              <p className="text-muted-foreground">
                Para uma melhor experiência de leitura, abra o PDF em uma nova aba ou faça o download.
              </p>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={openInNewTab}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
              >
                <Download className="w-4 h-4" />
                Baixar
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`bg-background rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col animate-scale-in ${isFullscreen ? 'fixed inset-0 max-w-none h-screen rounded-none' : ''}`}
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card rounded-t-lg">
          <h2 className="text-xl font-semibold text-foreground truncate pr-4">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Tela Cheia"
            >
              <Maximize className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Baixar PDF"
            >
              <Download className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={switchToExternalView}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Abrir Externamente"
            >
              <ExternalLink className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 bg-muted/10 p-4 overflow-hidden">
          <div className="h-full rounded-lg overflow-hidden shadow-lg relative">
            <iframe
              ref={iframeRef}
              src={getPdfUrl(currentPage)}
              className="w-full h-full border-0 transition-all duration-300 ease-out"
              title={title}
              style={{
                transform: 'translateX(0)',
                opacity: 1
              }}
              onError={() => {
                // If iframe fails, switch to external view
                setViewMode('external');
              }}
            />
            
            {/* Loading overlay during transitions */}
            {isTransitioning && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm text-muted-foreground">Carregando página...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-card">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || isTransitioning}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground font-medium">
              Página {currentPage}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page > 0) {
                    setCurrentPage(page);
                  }
                }}
                className="w-16 px-2 py-1 text-sm border border-border rounded text-center bg-background"
                min="1"
              />
            </div>
          </div>

          <button
            onClick={handleNextPage}
            disabled={isTransitioning}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <span className="hidden sm:inline">Próxima</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};