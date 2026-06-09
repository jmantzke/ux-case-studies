/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  // Dark mode via class on <html> element
  darkMode: 'class',

  theme: {
    // ─── Breakpoints (from Figma: grid and breakpoints) ───────────────────────
    screens: {
      xs: '200px',   // 200–479
      sm: '480px',   // 480–767
      md: '768px',   // 768–1023
      lg: '1024px',  // 1024–1439
      xl: '1440px',  // 1440–2600
    },

    extend: {
      // ─── Colors (from Figma: global/global > colors) ──────────────────────
      colors: {
        primary: {
          100: 'var(--color-primary-100)',  // #fff8e3
          200: 'var(--color-primary-200)',  // #fff0c4
          300: 'var(--color-primary-300)',  // #ffe39b
          400: 'var(--color-primary-400)',  // #ffa126
          500: 'var(--color-primary-500)',  // #ffa413
          600: 'var(--color-primary-600)',  // #b35e00 (AA pass)
          700: 'var(--color-primary-700)',  // #a65700
          800: 'var(--color-primary-800)',  // #673000
          900: 'var(--color-primary-900)',  // #301000
        },
        neutral: {
          100: 'var(--color-neutral-100)',  // #dbd8d5
          200: 'var(--color-neutral-200)',  // #c1bdba
          300: 'var(--color-neutral-300)',  // #a7a3a0
          400: 'var(--color-neutral-400)',  // #8d8885
          500: 'var(--color-neutral-500)',  // #736e6b
          600: 'var(--color-neutral-600)',  // #595452
          700: 'var(--color-neutral-700)',  // #3f3937
          800: 'var(--color-neutral-800)',  // #2b2726
          900: 'var(--color-neutral-900)',  // #181716
        },
        secondary: {
          100: 'var(--color-secondary-100)',  // #f4fbfc
          200: 'var(--color-secondary-200)',  // #e3f3f6
          300: 'var(--color-secondary-300)',  // #cfe9ed
          400: 'var(--color-secondary-400)',  // #b7dee3
          500: 'var(--color-secondary-500)',  // #9ed2db
          600: 'var(--color-secondary-600)',  // #2c7f8d
          700: 'var(--color-secondary-700)',  // #176270
          800: 'var(--color-secondary-800)',  // #0f4a54
          900: 'var(--color-secondary-900)',  // #08343b
        },
        white: '#ffffff',
        black: '#000000',

        // ─── Semantic surface roles (light mode defaults, dark via CSS vars) ──
        surface: {
          page:     'var(--surface-page)',
          1:        'var(--surface-1)',
          2:        'var(--surface-2)',
          3:        'var(--surface-3)',
          'page-alt': 'var(--surface-page-alt)',
          'card-rest':  'var(--surface-card-rest)',
          'card-hover': 'var(--surface-card-hover)',
        },
        text: {
          body:     'var(--text-body)',
          header:   'var(--text-header)',
          caption:  'var(--text-caption)',
          'header-reversed': 'var(--text-header-reversed)',
          slash:    'var(--text-slash)',
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

      // ─── Typography (from Figma: typography/Mode 1 + global/global) ────────
      fontFamily: {
        display: ['mozilla-headline', 'serif'],
        body:    ['ibm-plex-sans', 'sans-serif'],
      },

      fontSize: {
        // Named scale from Figma typography/size
        'label':   ['11px', { lineHeight: '14px',   letterSpacing: '0.02em' }],
        'caption': ['11px', { lineHeight: '16px',   letterSpacing: '0' }],
        'body-sm': ['12px', { lineHeight: '18px',   letterSpacing: '0' }],
        'body':    ['14px', { lineHeight: '28px',   letterSpacing: '0' }],
        'body-lg': ['16px', { lineHeight: '19.2px', letterSpacing: '0' }],
        'h5':      ['11px', { lineHeight: '13.2px', letterSpacing: '0.02em' }],
        'h4':      ['18px', { lineHeight: '21.6px', letterSpacing: '0' }],
        'h3':      ['24px', { lineHeight: '28.8px', letterSpacing: '0.01em' }],
        'h2':      ['48px', { lineHeight: '57.6px', letterSpacing: '0' }],
        'h1':      ['56px', { lineHeight: '67.2px', letterSpacing: '0' }],
        'hero2':   ['128px', { lineHeight: '153.6px', letterSpacing: '-0.01em' }],
        'hero1':   ['340px', { lineHeight: '408px',   letterSpacing: '-0.01em' }],
      },

      fontWeight: {
        'display-extralight': '200',
        'display-light':      '300',
        'display-regular':    '400',
        'display-medium':     '500',
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

      // ─── Spacing (from Figma: global/global > spacing > primitive) ─────────
      spacing: {
        '0':   '0px',
        '1':   '1px',
        '2':   '2px',
        '4':   '4px',
        '6':   '6px',
        '8':   '8px',
        '10':  '10px',
        '11':  '11px',
        '12':  '12px',
        '14':  '14px',
        '16':  '16px',
        '18':  '18px',
        '20':  '20px',
        '24':  '24px',
        '30':  '30px',
        '32':  '32px',
        '36':  '36px',
        '40':  '40px',
        '48':  '48px',
        '56':  '56px',
        '60':  '60px',
        '64':  '64px',
        '72':  '72px',
        '80':  '80px',
        '96':  '96px',
        '128': '128px',
        '144': '144px',
        '340': '340px',
      },

      // ─── Border radius (from Figma: spacing > radii) ───────────────────────
      borderRadius: {
        'none':  '0px',
        'xs':    '1px',
        'sm':    '4px',
        'msm':   '16px',
        'md':    '20px',
        'lg':    '32px',
        'round': '999px',
      },

      // ─── Sizes (from Figma: sizes/Mode 1) ─────────────────────────────────
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

      // ─── Max widths for containers ─────────────────────────────────────────
      maxWidth: {
        'case-study': '1200px',
        'body':       '1376px',
        'caption':    '800px',
        'image':      '1000px',
      },
    },
  },

  plugins: [],
}
