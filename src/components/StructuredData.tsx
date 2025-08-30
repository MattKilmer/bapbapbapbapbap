interface StructuredDataProps {
  data: any;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2)
      }}
    />
  );
}

interface SoundboardStructuredDataProps {
  soundboard: {
    id: string;
    name: string;
    description: string | null;
    plays: number;
    createdAt: Date;
    updatedAt: Date;
    user: {
      name: string | null;
      email: string;
      username: string | null;
    };
  };
}

export function SoundboardStructuredData({ soundboard }: SoundboardStructuredDataProps) {
  const creatorName = soundboard.user.name || soundboard.user.email || 'Unknown Creator';
  
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://bapbapbapbapbap.com/#webapp",
        "name": "BapBapBapBapBap",
        "url": "https://bapbapbapbapbap.com",
        "description": "Browser-based audio sampler for creating interactive soundboards and beats",
        "applicationCategory": "MusicApplication",
        "operatingSystem": "Web Browser",
        "softwareVersion": "1.0",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Browser-based sampler",
          "Interactive soundboards", 
          "Audio sample upload",
          "Beat creation",
          "Community sharing"
        ]
      },
      {
        "@type": "CreativeWork",
        "@id": `https://bapbapbapbapbap.com/play/${soundboard.id}`,
        "name": soundboard.name,
        "description": soundboard.description || `Interactive soundboard created with browser-based sampler featuring ${soundboard.name}`,
        "url": `https://bapbapbapbapbap.com/play/${soundboard.id}`,
        "dateCreated": soundboard.createdAt.toISOString(),
        "dateModified": soundboard.updatedAt.toISOString(),
        "creator": {
          "@type": "Person",
          "name": creatorName,
          "identifier": soundboard.user.username || soundboard.user.email
        },
        "publisher": {
          "@type": "Organization",
          "name": "BapBapBapBapBap",
          "url": "https://bapbapbapbapbap.com"
        },
        "genre": ["Electronic Music", "Beat Making", "Interactive Audio"],
        "keywords": [
          "soundboard",
          "browser-based sampler",
          "web-based sampler", 
          "interactive audio",
          "beats",
          "audio samples"
        ],
        "interactionStatistic": {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/PlayAction",
          "userInteractionCount": soundboard.plays
        },
        "isAccessibleForFree": true,
        "usageInfo": "https://bapbapbapbapbap.com/terms",
        "workExample": {
          "@type": "WebPage",
          "url": `https://bapbapbapbapbap.com/play/${soundboard.id}`
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://bapbapbapbapbap.com"
          },
          {
            "@type": "ListItem", 
            "position": 2,
            "name": "Explore",
            "item": "https://bapbapbapbapbap.com/explore"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": soundboard.name,
            "item": `https://bapbapbapbapbap.com/play/${soundboard.id}`
          }
        ]
      }
    ]
  };

  return <StructuredData data={structuredData} />;
}

export function WebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://bapbapbapbapbap.com/#website",
    "name": "BapBapBapBapBap",
    "url": "https://bapbapbapbapbap.com",
    "description": "Create and share interactive soundboards with our free browser-based sampler. Upload audio samples, create beats, and discover community soundboards.",
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://bapbapbapbapbap.com/explore?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    ],
    "sameAs": [
      "https://twitter.com/bapbapbapbapbap"
    ]
  };

  return <StructuredData data={structuredData} />;
}