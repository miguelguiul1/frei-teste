import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/**
 * Open Graph exige URLs absolutas. Usa VITE_SITE_URL ou, na Vercel,
 * o domínio de produção do projeto (VERCEL_PROJECT_PRODUCTION_URL).
 */
function absoluteOgUrls(siteUrl: string): Plugin {
  return {
    name: 'absolute-og-urls',
    transformIndexHtml(html) {
      if (!siteUrl) return html
      return html
        .replace('content="/og-image.jpg"', `content="${siteUrl}/og-image.jpg"`)
        .replace('<meta property="og:type"', `<meta property="og:url" content="${siteUrl}/" />\n    <link rel="canonical" href="${siteUrl}/" />\n    <meta property="og:type"`)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const vercelUrl = env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : ''
  const siteUrl = (env.VITE_SITE_URL || vercelUrl).replace(/\/$/, '')

  return {
    plugins: [react(), absoluteOgUrls(siteUrl)],
    resolve: {
      alias: { '@': path.resolve(import.meta.dirname, './src') },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
          },
        },
        onwarn(warning, warn) {
          // comentários /*#__PURE__*/ mal posicionados dentro do zod: inofensivo
          if (warning.code === 'INVALID_ANNOTATION' && warning.id?.includes('/zod/')) return
          warn(warning)
        },
      },
    },
  }
})
