import type { Metadata } from 'next'
import { IBM_Plex_Sans } from 'next/font/google'
import './globals.css'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Enfineitz — Jürgen Mantzke',
  description: 'The personal website of Jürgen Mantzke, UX and product designer',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
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
      className={`${ibmPlexSans.variable} h-full antialiased`}
    >
      <head>
        {/* mozilla-headline — Adobe Fonts kit nqe6jwf */}
        <link rel="stylesheet" href="https://use.typekit.net/nqe6jwf.css" />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  )
}
