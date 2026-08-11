import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mpgeventplanner.com'),
  title: {
    default: 'MPG Event Planner — Corporate Event Planning & Production in Cambodia',
    template: '%s | MPG Event Planner',
  },
  description: 'Premier event planning, grand openings, corporate ceremonies, stage production, and equipment rentals in Phnom Penh and across Cambodia.',
  applicationName: 'MPG Event Planner',
  authors: [{ name: 'MPG Event Planner Team', url: 'https://mpgeventplanner.com' }],
  creator: 'MPG Event Planner',
  publisher: 'MPG Event Planner',
  keywords: [
    'Event Planner Cambodia',
    'Event Production Phnom Penh',
    'Grand Opening Ceremonies Cambodia',
    'Corporate Event Organizer Phnom Penh',
    'Stage Design & Audio Visual Cambodia',
    'Event Management Company Cambodia',
  ],
  icons: { icon: '/images/mpg-favicon.png', apple: '/images/mpg-favicon.png' },
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
  openGraph: {
    title: 'MPG Event Planner — Professional Event Planning in Cambodia',
    description: 'Premier event planning, grand openings, corporate ceremonies, stage production, and equipment rentals in Phnom Penh and across Cambodia.',
    url: 'https://mpgeventplanner.com',
    siteName: 'MPG Event Planner',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://mpgeventplanner.com/images/mpg/hero-backstage-v2.png',
        width: 1200,
        height: 630,
        alt: 'MPG Event Planner Stage Production',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MPG Event Planner — Professional Event Planning in Cambodia',
    description: 'Premier event planning, grand openings, corporate ceremonies, stage production, and equipment rentals in Phnom Penh and across Cambodia.',
    images: ['https://mpgeventplanner.com/images/mpg/hero-backstage-v2.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

