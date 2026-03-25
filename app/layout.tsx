import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { SocketProvider } from '@/context/SocketContext';

export const metadata: Metadata = {
  title: 'Aura CRM - Spa & Wellness Automation',
  description: 'Modern SaaS CRM for Spa & Wellness businesses',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
