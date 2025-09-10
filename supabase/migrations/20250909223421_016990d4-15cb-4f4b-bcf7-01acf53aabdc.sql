-- Update sample data with proper image URLs
UPDATE public.conteudos SET
  url_capa = CASE 
    WHEN titulo = 'Guia de Primeiros Socorros' THEN '/src/assets/primeiros-socorros-cover.jpg'
    WHEN titulo = 'Receitas Saudáveis para Crianças' THEN '/src/assets/receitas-saudaveis-cover.jpg'
    WHEN titulo = 'Desenho para Colorir: Frutas' THEN '/src/assets/colorir-frutas-cover.jpg'
    WHEN titulo = 'Manual de Exercícios em Casa' THEN '/src/assets/exercicios-casa-cover.jpg'
    WHEN titulo = 'Desenho para Colorir: Animais' THEN '/src/assets/colorir-animais-cover.jpg'
    ELSE url_capa
  END;