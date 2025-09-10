import { useState, useEffect } from "react";
import { useContentsQuery } from "@/hooks/useContentsQuery";
import { Header } from "@/components/Header";
import { ContentGrid } from "@/components/ContentGrid";
import { PDFModal } from "@/components/PDFModal";
import { BannerCarousel } from "@/components/BannerCarousel";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Content {
  id: string;
  titulo: string;
  tipo: 'ebook' | 'desenho';
  url_capa: string;
  url_arquivo: string;
  created_at: string;
  updated_at: string;
}

const Index = () => {
  
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [activeFilter, setActiveFilter] = useState('todos');
  
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    pdfUrl: ''
  });
  
  const { toast } = useToast();

  const { data: contents = [], isLoading, isError, error } = useContentsQuery();

  // Fetch contents from Supabase

  // Filter contents based on active filter
  useEffect(() => {
    if (activeFilter === 'todos') {
      setFilteredContents(contents);
    } else {
      setFilteredContents(contents.filter(content => content.tipo === activeFilter));
    }
  }, [contents, activeFilter]);

  useEffect(() => {
    if (isError) {
      console.error('Error fetching contents:', error);
      toast({
        title: "Erro ao carregar conteúdo",
        description: "Não foi possível carregar os conteúdos. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  // Initial load

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  // Handle read/view action
  const handleRead = (id: string, titulo: string, url_arquivo: string) => {
    setModalState({
      isOpen: true,
      title: titulo,
      pdfUrl: url_arquivo
    });
  };

  // Handle download action
  const handleDownload = async (url_arquivo: string, titulo: string) => {
    try {
      // In a real implementation, you would handle the actual file download
      // For now, we'll show a toast and open the URL
      window.open(url_arquivo, '_blank');
      
      toast({
        title: "Download iniciado",
        description: `Baixando "${titulo}"...`,
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o arquivo. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Close modal
  const closeModal = () => {
    setModalState({
      isOpen: false,
      title: '',
      pdfUrl: ''
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Banner Carousel */}
        <BannerCarousel />
        
        {/* Welcome Section */}
        <div className="text-center mb-12 space-y-4 fade-in">
          <h2 className="text-4xl font-semibold text-foreground">
            Bem-vindo à sua biblioteca digital
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubra ebooks de saúde e desenhos para colorir cuidadosamente selecionados. 
            Leia online ou baixe para levar onde quiser.
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {contents.filter(c => c.tipo === 'ebook').length}
              </div>
              <div className="text-sm text-muted-foreground">Ebooks</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {contents.filter(c => c.tipo === 'desenho').length}
              </div>
              <div className="text-sm text-muted-foreground">Desenhos</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {contents.length}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <ContentGrid
          contents={filteredContents}
          isLoading={isLoading}
          onRead={handleRead}
          onDownload={handleDownload}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Carregando conteúdos...</span>
            </div>
          </div>
        )}
      </main>

      {/* PDF Modal */}
      <PDFModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        pdfUrl={modalState.pdfUrl}
      />
    </div>
  );
};

export default Index;