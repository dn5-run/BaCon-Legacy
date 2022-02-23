import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            'bacon-client': 'bacon-client/src/index.ts',
            'bacon-types': 'bacon-types/src/index.ts',
        },
    },
})
