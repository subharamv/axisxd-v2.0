/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: ['./src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      fontFamily: {
        // Resolved through --font-sans so the header font switcher moves the
        // utility classes too. Default is Syne; see styles.scss.
        sans: ['var(--font-sans)'],
        syne: ['var(--font-sans)'],
        space: ['var(--font-sans)'],
        // Mono resolves through its own token so the switcher moves these
        // too. Defaults to JetBrains Mono; see styles.scss.
        mono: ['var(--font-mono)'],
        // Display numerals. Roboto Mono matches JetBrains Mono's width and
        // weight but has a plain zero, where JetBrains Mono's only zeros are
        // dotted (default) or slashed (its `zero` feature) — neither wanted.
        'mono-num': ['var(--font-mono-num)'],
      },
      // Three shape steps, not ten. Tailwind's rounded-* utilities are
      // remapped onto them so the ~170 existing usage sites collapse to
      // control (10px) / card (20px) / pill without touching markup.
      borderRadius: {
        none: '0',
        sm: '0.375rem',
        DEFAULT: '0.625rem',
        md: '0.625rem',
        lg: '0.625rem',
        xl: '1.25rem',
        '2xl': '1.25rem',
        '3xl': '1.25rem',
        full: '9999px',
      },
      colors: {
        brand: {
          DEFAULT: '#0645fb',
          dark: '#1A1A1A',
          mid: '#595959',
        },
        blue: {
          400: '#6088fd',
          500: '#2e62fc',
          600: '#0645fb',
          700: '#0337d4',
        },
      },
    },
  },
  plugins: [],
};
