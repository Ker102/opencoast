import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'discovery-page-routes',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (['/about', '/how-it-works', '/evidence'].includes(req.url?.split('?')[0] ?? ''))
            req.url = req.url?.replace(/^(\/[^?]+)(\?.*)?$/, '$1.html$2');
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (['/about', '/how-it-works', '/evidence'].includes(req.url?.split('?')[0] ?? ''))
            req.url = req.url?.replace(/^(\/[^?]+)(\?.*)?$/, '$1.html$2');
          next();
        });
      },
    },
  ],
  server: { port: 5173 },
});
