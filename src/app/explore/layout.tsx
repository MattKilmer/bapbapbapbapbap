import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Explore Community Soundboards",
  description: "Discover amazing soundboards created by musicians and creators worldwide. Browse our collection of browser-based sampler projects, beats, and interactive audio experiences. Find inspiration for your next web-based sampler creation.",
  keywords: ["soundboard discovery", "community beats", "browser-based sampler", "web-based sampler", "sampler", "music community", "beat sharing", "audio samples", "interactive soundboards", "music exploration"],
  openGraph: {
    title: "Explore Community Soundboards | BapBapBapBapBap",
    description: "Discover amazing soundboards created by musicians and creators worldwide. Browse our collection of browser-based sampler projects and interactive audio experiences.",
    url: 'https://bapbapbapbapbap.com/explore',
  },
  twitter: {
    title: "Explore Community Soundboards | BapBapBapBapBap",
    description: "Discover amazing soundboards created by musicians and creators worldwide. Browse our collection of browser-based sampler projects and interactive audio experiences.",
  },
  alternates: {
    canonical: 'https://bapbapbapbapbap.com/explore',
  },
}

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}