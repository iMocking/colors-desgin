import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from "@vitejs/plugin-vue-jsx"
import {resolve} from 'path'

export default defineConfig({
    plugins: [vue(), jsx()],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'ColorsDesign',
            fileName: 'colors-desgin'
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        }
    }
})
