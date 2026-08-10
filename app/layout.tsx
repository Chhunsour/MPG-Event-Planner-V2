import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mpgeventplanner.com'),
  title: {
    default: 'MPG Event Planner',
    template: '%s — MPG Event Planner',
  },
  description: 'Event planning and production in Cambodia.',
  icons: { icon: '/images/mpg-favicon.png' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

