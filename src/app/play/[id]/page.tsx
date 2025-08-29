import { Metadata } from 'next';
import { db as prisma } from '@/lib/db';
import { PlaySoundboardClient } from './PlaySoundboardClient';

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
          select: { name: true, email: true }
        }
      }
    });

    if (!soundboard) {
      return {
        title: 'Soundboard Not Found - BapBapBapBapBap',
        description: 'The requested soundboard could not be found.',
      };
    }

    const creatorName = soundboard.user.name || soundboard.user.email || 'Unknown Creator';
    const title = `${soundboard.name} by ${creatorName}`;
    const description = soundboard.description || `Play ${soundboard.name} by ${creatorName} now on BapBapBapBapBap - interactive audio-visual experience`;
    
    return {
      title: `${title} - BapBapBapBapBap`,
      description,
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
            alt: title,
            type: 'image/png',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: `${description} - Play it now on BapBapBapBapBap`,
        images: ['https://bapbapbapbapbap.com/og-image.png'],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'BapBapBapBapBap',
      description: 'Interactive audio-visual experience - just tap it',
    };
  }
}

export default function PlaySoundboard({ params }: Props) {
  return <PlaySoundboardClient params={params} />;
}