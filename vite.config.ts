import path from 'node:path'
import mdx from '@mdx-js/rollup'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import remarkGfm from 'remark-gfm'
import rehypeMdxTitle from 'rehype-mdx-title'
import rehypePrettyCode from 'rehype-pretty-code'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeMdxTitle,
          [
            rehypePrettyCode,
            {
              theme: 'github-dark',
              keepBackground: false,
              bypassInlineCode: true,
              defaultLang: 'plaintext',
            },
          ],
        ],
      }),
    },
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
