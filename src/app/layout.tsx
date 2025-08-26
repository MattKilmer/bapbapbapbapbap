import type { Metadata } from "next";
import { Geist, Geist_Mono, Comfortaa } from "next/font/google";
import { Providers } from '@/components/providers';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bapbapbapbapbap.com'),
  title: "BapBapBapBapBap",
  description: "Interactive audio-visual experience - just tap it",
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
    shortcut: '/icon',
  },
  openGraph: {
    title: "BapBapBapBapBap",
    description: "Interactive audio-visual experience - just tap it",
    type: "website",
    locale: "en_US",
    siteName: "BapBapBapBapBap",
    url: 'https://bapbapbapbapbap.com',
    images: [
      {
        url: 'https://bapbapbapbapbap.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BapBapBapBapBap - just tap it',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BapBapBapBapBap",
    description: "Interactive audio-visual experience - just tap it",
    images: ['https://bapbapbapbapbap.com/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional Open Graph meta tags for Facebook */}
        <meta property="og:image" content="https://bapbapbapbapbap.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:url" content="https://bapbapbapbapbap.com" />
        <meta property="og:type" content="website" />
        
        {/* Twitter meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://bapbapbapbapbap.com/og-image.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${comfortaa.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
