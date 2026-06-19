/** @type {import('tailwindcss').Config} */
/* AUTO-GENERATED — do not edit by hand. Run: node scripts/sync-tokens.mjs */

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  darkMode: 'class',

  theme: {
    screens: {
      xs: '200px',
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
    },

    extend: {
      colors: {
        primary: {
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        neutral: {
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        },
        secondary: {
          100: 'var(--color-secondary-100)',
          200: 'var(--color-secondary-200)',
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)',
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
          800: 'var(--color-secondary-800)',
          900: 'var(--color-secondary-900)',
        },
        white: '#ffffff',
        black: '#000000',

        surface: {
          page:         'var(--surface-page)',
          1:            'var(--surface-1)',
          2:            'var(--surface-2)',
          3:            'var(--surface-3)',
          'page-alt':   'var(--surface-page-alt)',
          'card-rest':  'var(--surface-card-rest)',
          'card-hover': 'var(--surface-card-hover)',
        },
        text: {
          body:              'var(--text-body)',
          header:            'var(--text-header)',
          caption:           'var(--text-caption)',
          'header-reversed': 'var(--text-header-reversed)',
          slash:             'var(--text-slash)',
        },
        border: {
          'card-rest':  'var(--border-card-rest)',
          'card-hover': 'var(--border-card-hover)',
        },
        accent: {
          'decorative-corner': 'var(--accent-decorative-corner)',
        },
        interaction: {
          'link-rest':    'var(--link-rest)',
          'link-hover':   'var(--link-hover)',
          'link-active':  'var(--link-active)',
          'crumb-rest':   'var(--crumb-rest)',
          'crumb-static': 'var(--crumb-static)',
          'crumb-hover':  'var(--crumb-hover)',
          'crumb-active': 'var(--crumb-active)',
        },
      },

      fontFamily: {
        display: ['heimat-stencil', 'var(--font-ibm-plex-sans)', 'Helvetica', 'Arial', 'sans-serif'],
        body:    ['var(--font-ibm-plex-sans)', 'Helvetica', 'Arial', 'sans-serif'],
      },

      fontSize: {
        // Auto-generated from tokens/enfineitz-tokens.json
        'label': ['11px', { lineHeight: '14px', letterSpacing: '0.02em' }],
        'caption': ['11px', { lineHeight: '16px', letterSpacing: '0' }],
        'body-sm': ['12px', { lineHeight: '18px', letterSpacing: '0' }],
        'body': ['14px', { lineHeight: '28px', letterSpacing: '0' }],
        'body-lg': ['16px', { lineHeight: '19.2px', letterSpacing: '0' }],
        'h5': ['11px', { lineHeight: '13.2px', letterSpacing: '0.02em' }],
        'h4': ['18px', { lineHeight: '21.6px', letterSpacing: '0' }],
        'h3': ['24px', { lineHeight: '28.8px', letterSpacing: '0.01em' }],
        'h2': ['48px', { lineHeight: '57.6px', letterSpacing: '0' }],
        'h1': ['56px', { lineHeight: '67.2px', letterSpacing: '0' }],
        'hero2': ['128px', { lineHeight: '153.6px', letterSpacing: '-0.01em' }],
        'hero1': ['340px', { lineHeight: '408px', letterSpacing: '-0.01em' }],
      },

      fontWeight: {
        'display-extralight': '200',
        'display-light':      '300',
        'display-regular':    '400',
        'display-medium':     '500',
        'display-bold':       '600',
        'body-regular':       '400',
        'body-medium':        '500',
        'body-bold':          '700',
      },

      lineHeight: {
        'none':    '1',
        'tight':   '1.1',
        'snug':    '1.25',
        'normal':  '1.5',
        'relaxed': '1.625',
        'loose':   '2',
      },

      letterSpacing: {
        'tighter': '-0.04em',
        'tight':   '-0.02em',
        'normal':  '0',
        'wide':    '0.01em',
        'wider':   '0.05em',
        'widest':  '0.1em',
      },

      spacing: {
        // Auto-generated from tokens/enfineitz-tokens.json spacing primitives
        '0': '0px',
        '1': '1px',
        '2': '2px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
        '10': '10px',
        '11': '11px',
        '12': '12px',
        '14': '14px',
        '16': '16px',
        '18': '18px',
        '20': '20px',
        '24': '24px',
        '30': '30px',
        '32': '32px',
        '36': '36px',
        '40': '40px',
        '48': '48px',
        '56': '56px',
        '60': '60px',
        '64': '64px',
        '72': '72px',
        '80': '80px',
        '96': '96px',
        '128': '128px',
        '144': '144px',
        '340': '340px',
      },

      borderRadius: {
        'none': '0px',
        'xs': '1px',
        'sm': '4px',
        'msm': '16px',
        'md': '20px',
        'lg': '32px',
        'round': '999px',
      },

      width: {
        'card':       '300px',
        'badge-cert': '70px',
        'nav-col-xl': '340px',
      },
      height: {
        'card':       '180px',
        'badge-cert': '70px',
        'screen-ref': '900px',
      },

      maxWidth: {
        'case-study': '1200px',
        'body':       '1376px',
        'caption':    '800px',
        'image':      '1000px',
      },
    },
  },

  plugins: [],
};
