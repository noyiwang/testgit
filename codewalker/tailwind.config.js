/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--brand-background)',
        foreground: 'var(--brand-foreground)',
        card: 'var(--brand-card)',
        'card-foreground': 'var(--brand-card-foreground)',
        muted: 'var(--brand-muted)',
        'muted-foreground': 'var(--brand-muted-foreground)',
        primary: 'var(--brand-primary)',
        'primary-foreground': 'var(--brand-primary-foreground)',
        secondary: 'var(--brand-secondary)',
        'secondary-foreground': 'var(--brand-secondary-foreground)',
        accent: 'var(--brand-accent)',
        'accent-foreground': 'var(--brand-accent-foreground)',
        border: 'var(--brand-border)',
        input: 'var(--brand-input)',
        ring: 'var(--brand-ring)',
      },
      fontFamily: {
        serif: ['Georgia', 'Noto Serif SC', 'serif'],
        sans: ['Inter', 'Noto Sans SC', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'small': '0.375rem',
        'medium': '0.5rem',
        'large': '0.75rem',
        'xlarge': '1rem',
      },
    },
  },
  plugins: [],
}
