import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Adicione a linha abaixo para corrigir o caminho no GitHub Pages
  base: '/club/',

  server: {
    host: ':',
    port: 3000,
  },
  plugins: [react()], // Deixei a parte do "lovable-tagger" mais limpa
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
