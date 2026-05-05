// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://fuxi.com',
  server: {
    port: 3000,
    open: true
  },

  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: true },
  },

  redirects: {
    '/': '/en/',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
