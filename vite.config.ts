import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

import { seo } from './src/config/seo'

const escapeHtml = (v: string) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Injeta no index.html os textos de SEO gerados a partir de src/config/evento.ts. */
function seoFromConfig(): Plugin {
  const tokens: Record<string, string> = {
    __SEO_TITLE__: seo.title,
    __SEO_DESCRIPTION__: seo.description,
    __SEO_OG_TITLE__: seo.ogTitle,
    __SEO_OG_DESCRIPTION__: seo.ogDescription,
  }
  return {
    name: 'seo-from-config',
    transformIndexHtml(html) {
      return Object.entries(tokens).reduce((acc, [token, value]) => acc.replaceAll(token, escapeHtml(value)), html)
    },
  }
}

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
    plugins: [react(), seoFromConfig(), absoluteOgUrls(siteUrl)],
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
