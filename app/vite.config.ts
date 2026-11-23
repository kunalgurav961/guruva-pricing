import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// viteSingleFile inlines JS, CSS and fonts into one dist/index.html so the pitch
// can be emailed or opened offline like the original single-file version.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: { assetsInlineLimit: 100000000 },
})
