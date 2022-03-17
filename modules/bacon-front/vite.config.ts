import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    resolve: {
        alias: {
            'bacon-client': 'bacon-client/src/index.ts',
            'bacon-types': 'bacon-types/src/index.ts',
            'attr-accept': '../bacon-front/src/replaces/attr-accept/index.ts',
        },
    },
})
