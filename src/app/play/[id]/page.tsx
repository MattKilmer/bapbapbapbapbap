import { Metadata } from 'next';
import { db as prisma } from '@/lib/db';
import { PlaySoundboardClient } from './PlaySoundboardClient';
import { SoundboardStructuredData } from '@/components/StructuredData';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const soundboard = await prisma.soundboard.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true, username: true }
        }
      }
    });

    if (!soundboard) {
      return {
        title: 'Soundboard Not Found',
        description: 'The requested browser-based sampler soundboard could not be found. Explore our collection of web-based sampler projects instead.',
        keywords: ['soundboard', 'browser-based sampler', 'web-based sampler', 'sampler', 'not found'],
        alternates: {
          canonical: `https://bapbapbapbapbap.com/play/${id}`,
        },
      };
    }

    const creatorName = soundboard.user.name || soundboard.user.email || 'Unknown Creator';
    const title = `${soundboard.name} by ${creatorName}`;
    const baseDescription = soundboard.description || `Interactive soundboard featuring ${soundboard.name} by ${creatorName}`;
    const description = `${baseDescription}. Experience this browser-based sampler creation with interactive audio samples and beats. Play now on our web-based sampler platform.`;
    
    return {
      title: `${title}`,
      description,
      keywords: [
        'soundboard',
        'browser-based sampler', 
        'web-based sampler',
        'sampler',
        'interactive audio',
        'audio samples',
        'beats',
        'music production',
        soundboard.name.toLowerCase(),
        creatorName.toLowerCase(),
        'play soundboard',
        'online sampler'
      ],
      authors: [{ name: creatorName }],
      creator: creatorName,
      openGraph: {
        title,
        description: `${description} - Play it now on BapBapBapBapBap`,
        type: 'website',
        locale: 'en_US',
        siteName: 'BapBapBapBapBap',
        url: `https://bapbapbapbapbap.com/play/${id}`,
        images: [
          {
            url: 'https://bapbapbapbapbap.com/og-image.png',
            width: 1200,
            height: 630,
            alt: `${title} - Interactive browser-based sampler soundboard`,
            type: 'image/png',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: `${baseDescription} - Play this browser-based sampler soundboard now!`,
        images: ['https://bapbapbapbapbap.com/og-image.png'],
        creator: soundboard.user.username ? `@${soundboard.user.username}` : undefined,
      },
      alternates: {
        canonical: `https://bapbapbapbapbap.com/play/${id}`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      category: 'Music',
      other: {
        'article:author': creatorName,
        'article:tag': 'browser-based sampler,web-based sampler,soundboard,interactive audio',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'BapBapBapBapBap - Browser-Based Audio Sampler',
      description: 'Interactive browser-based sampler experience. Create beats and soundboards with our web-based sampler platform.',
      keywords: ['browser-based sampler', 'web-based sampler', 'sampler', 'interactive audio'],
    };
  }
}

export default async function PlaySoundboard({ params }: Props) {
  const { id } = await params;
  
  // Fetch soundboard data for structured data
  let soundboard = null;
  try {
    soundboard = await prisma.soundboard.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        plays: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: { name: true, email: true, username: true }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching soundboard for structured data:', error);
  }

  return (
    <>
      {soundboard && <SoundboardStructuredData soundboard={soundboard} />}
      <PlaySoundboardClient params={params} />
    </>
  );
}