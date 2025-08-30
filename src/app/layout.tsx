import type { Metadata } from "next";
import { Geist, Geist_Mono, Comfortaa } from "next/font/google";
import { Providers } from '@/components/providers';
import { Analytics } from "@vercel/analytics/next";
import { WebsiteStructuredData } from '@/components/StructuredData';
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
  title: {
    default: "BapBapBapBapBap - Browser-Based Audio Sampler",
    template: "%s | BapBapBapBapBap"
  },
  description: "Create and share interactive soundboards with our free browser-based sampler. Upload audio samples, create beats, and discover community soundboards. No downloads required - web-based sampler for musicians and creators.",
  keywords: ["sampler", "browser-based sampler", "web-based sampler", "soundboard", "audio samples", "beat maker", "music production", "online sampler", "interactive audio", "sound effects"],
  authors: [{ name: "BapBapBapBapBap Team" }],
  creator: "BapBapBapBapBap",
  publisher: "BapBapBapBapBap",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
    shortcut: '/icon',
  },
  openGraph: {
    title: "BapBapBapBapBap - Browser-Based Audio Sampler",
    description: "Create and share interactive soundboards with our free browser-based sampler. Upload audio samples, create beats, and discover community soundboards.",
    type: "website",
    locale: "en_US",
    siteName: "BapBapBapBapBap",
    url: 'https://bapbapbapbapbap.com',
    images: [
      {
        url: 'https://bapbapbapbapbap.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BapBapBapBapBap - Browser-based audio sampler for creating interactive soundboards',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BapBapBapBapBap - Browser-Based Audio Sampler",
    description: "Create and share interactive soundboards with our free browser-based sampler. Upload audio samples, create beats, and discover community soundboards.",
    images: ['https://bapbapbapbapbap.com/og-image.png'],
    creator: "@bapbapbapbapbap",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'Music',
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
        <WebsiteStructuredData />
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
