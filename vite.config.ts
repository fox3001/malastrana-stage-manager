import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';

export default defineConfig({
  plugins: [
    tanstackStart({
      target: 'react',
    }),
    tailwindcss(),
  ],
});
