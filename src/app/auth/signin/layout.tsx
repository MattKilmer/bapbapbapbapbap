import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Sign In - Access Your Soundboards",
  description: "Sign in to your BapBapBapBapBap account to access your personal soundboards and browser-based sampler projects. Create, edit, and share your web-based sampler creations with the community.",
  keywords: ["sign in", "login", "account access", "browser-based sampler", "web-based sampler", "sampler", "soundboard access", "user account", "music production login"],
  openGraph: {
    title: "Sign In | BapBapBapBapBap",
    description: "Sign in to access your personal soundboards and browser-based sampler projects. Create, edit, and share your web-based sampler creations.",
    url: 'https://bapbapbapbapbap.com/auth/signin',
  },
  twitter: {
    title: "Sign In | BapBapBapBapBap",
    description: "Sign in to access your personal soundboards and browser-based sampler projects.",
  },
  alternates: {
    canonical: 'https://bapbapbapbapbap.com/auth/signin',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}