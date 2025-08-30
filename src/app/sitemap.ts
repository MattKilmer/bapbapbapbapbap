import { MetadataRoute } from 'next'
import { db as prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bapbapbapbapbap.com'

  // Get all public soundboards
  const soundboards = await prisma.soundboard.findMany({
    where: { isPublic: true },
    select: { id: true, updatedAt: true }
  })

  // Get all users with usernames
  const users = await prisma.user.findMany({
    where: { 
      username: { not: null },
      soundboards: {
        some: { isPublic: true }
      }
    },
    select: { username: true, updatedAt: true }
  })

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Add soundboard play pages
  const soundboardPages = soundboards.map((soundboard) => ({
    url: `${baseUrl}/play/${soundboard.id}`,
    lastModified: soundboard.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Add user profile pages
  const userPages = users.map((user) => ({
    url: `${baseUrl}/user/${user.username}`,
    lastModified: user.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...soundboardPages, ...userPages]
}