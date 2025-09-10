-- Create Saúde Fácil content table
CREATE TABLE public.conteudos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('ebook', 'desenho')),
  url_capa TEXT NOT NULL,
  url_arquivo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.conteudos ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to conteudos" 
ON public.conteudos 
FOR SELECT 
USING (true);

-- Create storage bucket for content files and covers
INSERT INTO storage.buckets (id, name, public) 
VALUES ('content-files', 'content-files', true);

-- Create storage policies for public access
CREATE POLICY "Public Access to content files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'content-files');

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_conteudos_updated_at
BEFORE UPDATE ON public.conteudos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.conteudos (titulo, tipo, url_capa, url_arquivo) VALUES
('Guia de Primeiros Socorros', 'ebook', 'https://via.placeholder.com/300x400/4A90E2/FFFFFF?text=Primeiros+Socorros', 'https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=PDF+Content'),
('Receitas Saudáveis para Crianças', 'ebook', 'https://via.placeholder.com/300x400/50E3C2/FFFFFF?text=Receitas+Saudáveis', 'https://via.placeholder.com/800x600/50E3C2/FFFFFF?text=PDF+Content'),
('Desenho para Colorir: Frutas', 'desenho', 'https://via.placeholder.com/300x400/FFB74D/FFFFFF?text=Colorir+Frutas', 'https://via.placeholder.com/800x600/FFB74D/FFFFFF?text=Desenho+Frutas'),
('Manual de Exercícios em Casa', 'ebook', 'https://via.placeholder.com/300x400/9C27B0/FFFFFF?text=Exercícios', 'https://via.placeholder.com/800x600/9C27B0/FFFFFF?text=PDF+Content'),
('Desenho para Colorir: Animais', 'desenho', 'https://via.placeholder.com/300x400/FF7043/FFFFFF?text=Colorir+Animais', 'https://via.placeholder.com/800x600/FF7043/FFFFFF?text=Desenho+Animais');