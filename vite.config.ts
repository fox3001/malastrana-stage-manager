import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin';

export default defineConfig({
  plugins: [
    tanstackStart({
      target: 'react',
      entry: './src/start.ts',
    }),
    tailwindcss(),
  ],
});
