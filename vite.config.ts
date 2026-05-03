import { defineConfig } from 'vite'

export default defineConfig({
    root: 'src',
    base: '/wirbel/',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
    },
})
