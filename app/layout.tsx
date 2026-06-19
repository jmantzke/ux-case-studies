import type { Metadata } from 'next'
import { IBM_Plex_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://case-studies.enfineitz.com'),
  title: 'Enfineitz — Jürgen Mantzke',
  description: 'The personal website of Jürgen Mantzke, UX and product designer',
  openGraph: {
    title: 'Enfineitz — Jürgen Mantzke',
    description:
      'The personal website of Jürgen Mantzke, UX and product designer',
    url: '/',
    siteName: 'Enfineitz',
    type: 'website',
    images: [
      {
        url: '/og/placeholder.png',
        width: 1200,
        height: 630,
        alt: 'Enfineitz — Jürgen Mantzke, UX and product designer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enfineitz — Jürgen Mantzke',
    description:
      'The personal website of Jürgen Mantzke, UX and product designer',
    images: ['/og/placeholder.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSans.variable} dark h-full antialiased`}
    >
      <head>
        {/* heimat-stencil — Adobe Fonts kit nqe6jwf */}
        <link rel="stylesheet" href="https://use.typekit.net/nqe6jwf.css" />
      </head>
      <body className="min-h-full">{children}</body>

      {/* Google tag (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-NWDS4STFYK"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-NWDS4STFYK');`}
      </Script>
    </html>
  )
}
