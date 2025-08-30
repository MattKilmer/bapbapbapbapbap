import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Create Account - Start Making Soundboards",
  description: "Join BapBapBapBapBap for free and start creating interactive soundboards with our browser-based sampler. Upload samples, create beats, and share your web-based sampler projects with the music community.",
  keywords: ["create account", "sign up", "join", "browser-based sampler", "web-based sampler", "sampler", "free account", "soundboard creation", "music production", "beat maker"],
  openGraph: {
    title: "Create Account | BapBapBapBapBap",
    description: "Join BapBapBapBapBap for free and start creating interactive soundboards with our browser-based sampler. Upload samples and create beats.",
    url: 'https://bapbapbapbapbap.com/auth/signup',
  },
  twitter: {
    title: "Create Account | BapBapBapBapBap",
    description: "Join BapBapBapBapBap for free and start creating interactive soundboards with our browser-based sampler.",
  },
  alternates: {
    canonical: 'https://bapbapbapbapbap.com/auth/signup',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}