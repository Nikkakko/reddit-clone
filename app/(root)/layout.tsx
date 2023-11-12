import SiteFooter from '@/components/layout/SiteFooter';
import SiteHeader from '@/components/layout/SiteHeader';
import { currentUser } from '@clerk/nextjs';

interface LobbyLayoutProps {
  children: React.ReactNode;
}

export default async function LobbyLayout({ children }: LobbyLayoutProps) {
  const user = await currentUser();

  return (
    <div className='relative flex min-h-screen flex-col'>
      <SiteHeader user={user} />
      <main className='container max-w-7xl mx-auto h-full pt-12'>
        {children}
      </main>
      {/* <SiteFooter /> */}
    </div>
  );
}
