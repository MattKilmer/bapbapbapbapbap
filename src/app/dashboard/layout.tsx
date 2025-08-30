import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "My Dashboard - Manage Your Soundboards",
  description: "Manage your personal collection of soundboards and browser-based sampler projects. Create new beats, edit existing soundboards, and track your web-based sampler creations in your personal dashboard.",
  keywords: ["dashboard", "my soundboards", "manage soundboards", "browser-based sampler", "web-based sampler", "sampler", "personal projects", "soundboard management", "music production dashboard"],
  openGraph: {
    title: "My Dashboard | BapBapBapBapBap",
    description: "Manage your personal collection of soundboards and browser-based sampler projects. Create and edit your web-based sampler creations.",
    url: 'https://bapbapbapbapbap.com/dashboard',
  },
  twitter: {
    title: "My Dashboard | BapBapBapBapBap",
    description: "Manage your personal collection of soundboards and browser-based sampler projects.",
  },
  alternates: {
    canonical: 'https://bapbapbapbapbap.com/dashboard',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}