import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import nitro from 'nitro/plugin';
import viteReact from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    viteReact(),
    tanstackStart(),
    nitro(),
    tailwindcss(),
  ],
});
