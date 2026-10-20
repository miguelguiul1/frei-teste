import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

/**
 * Tokens extraídos do Figma "Feira de Profissões Frei" (frame Landing Page, 1440px).
 * Cores amostradas diretamente do arquivo; tamanhos tipográficos medidos no frame desktop.
 */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '3rem', xl: '5rem' },
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1440px' },
    },
    extend: {
      colors: {
        brand: {
          navy: '#042A7E',
          blue: '#2C5EC9',
          sky: '#D8EFFF',
          mist: '#F6F6F6',
          ink: '#000000',
          // tons intermediários vistos nos degradês do Figma
          'blue-soft': '#7293D8',
          'navy-soft': '#5B74AB',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      fontFamily: {
        sans: ['"Work Sans"', 'system-ui', 'sans-serif'],
        display: ['"Work Sans"', 'system-ui', 'sans-serif'],
        footer: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // [mobile → desktop] via clamp; o valor máximo é o medido no Figma
        display: ['clamp(2.5rem, 1.6rem + 3.8vw, 4.5rem)', { lineHeight: '1.08', letterSpacing: '-0.01em' }], // 72px
        title: ['clamp(2.25rem, 1.6rem + 2.8vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }], // 64px
        'title-sm': ['clamp(2rem, 1.5rem + 2vw, 3.5rem)', { lineHeight: '1.1' }], // 56px
        subtitle: ['clamp(1.375rem, 1.1rem + 1vw, 2rem)', { lineHeight: '1.25' }], // 32px
        lead: ['clamp(1.125rem, 0.95rem + 0.8vw, 1.75rem)', { lineHeight: '1.25' }], // 28px
        'body-lg': ['clamp(1.0625rem, 0.95rem + 0.4vw, 1.375rem)', { lineHeight: '1.35' }], // 22px
        body: ['1.125rem', { lineHeight: '1.3' }], // 18px
      },
      spacing: {
        section: 'clamp(4rem, 3rem + 4vw, 6.5rem)', // ~104px entre blocos no desktop
        gutter: '5rem', // 80px de margem lateral do frame
      },
      maxWidth: {
        frame: '1440px',
        content: '1280px',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        btn: '10px',
        card: '24px',
        'card-lg': '32px',
        icon: '24px',
      },
      boxShadow: {
        // sombra padrão dos botões/cards no Figma: 0 4 4 rgba(0,0,0,.25)
        figma: '0 4px 4px rgba(0, 0, 0, 0.25)',
        card: '0 4px 12px rgba(4, 42, 126, 0.18)',
        'card-hover': '0 12px 28px rgba(4, 42, 126, 0.24)',
      },
      backgroundImage: {
        // degradês amostrados no frame Landing Page
        'grad-sky': 'linear-gradient(180deg, #D8EFFF 0%, #FFFFFF 100%)',
        'grad-programacao':
          'linear-gradient(180deg, #4F71AC 0%, #B4CEE9 22%, #DBF0FF 36%, #F8FCFF 75%, #FFFFFF 100%)',
        'grad-why': 'linear-gradient(180deg, #FBFCFD 0%, #CAD2E3 25%, #7086B6 50%, #2F4F94 75%, #042A7E 100%)',
        'grad-icon': 'linear-gradient(180deg, #2C5EC9 0%, #042A7E 100%)',
        'grad-card-blue': 'linear-gradient(165deg, #92AADF 0%, #5A81D3 45%, #2C5EC9 100%)',
        'grad-parceiros': 'linear-gradient(180deg, #042A7E 0%, #2C5EC9 100%)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'fade-up': { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [animate],
} satisfies Config
