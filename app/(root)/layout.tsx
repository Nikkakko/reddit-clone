import SiteHeader from '@/components/layout/SiteHeader';

interface LobbyLayoutProps {
  children: React.ReactNode;
}

export default async function LobbyLayout({ children }: LobbyLayoutProps) {
  return (
    <div className='relative flex min-h-screen flex-col'>
      <SiteHeader />
      <main className='container max-w-7xl mx-auto h-full pt-12'>
        {children}
      </main>
    </div>
  );
}
