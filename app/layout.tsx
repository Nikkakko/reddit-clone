import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/Providers';
import { fontMono, fontSans } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'Reddit Clone',
  description: 'A Reddit clone built with Next.js and Shadcn/ui',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning>
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            fontSans.variable,
            fontMono.variable
          )}
        >
          <Providers attribute='class' defaultTheme='dark' enableSystem>
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
