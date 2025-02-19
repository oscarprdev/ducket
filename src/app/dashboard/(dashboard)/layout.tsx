import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { DashboardHeader } from '~/components/dashboard/dashboard-header';
import DashboardSidebar from '~/components/dashboard/dashboard-sidebar';
import { Toaster } from '~/components/ui/toaster';
import { cn } from '~/lib/utils';
import '~/styles/globals.css';

export const metadata: Metadata = {
  title: 'Ducket Dashboard',
  description: 'Dashboard for Ducket',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col bg-background">
            <DashboardHeader className="fixed left-0 right-0 top-0 z-50 border-b" />
            <div className="flex flex-1 pt-16">
              <div className="fixed bottom-0 left-0 top-16">
                <DashboardSidebar />
              </div>
              <main
                className={cn(
                  'ml-[var(--sidebar-width)] flex-1 overflow-y-auto p-6 transition-[margin]',
                  'data-[collapsed=true]:ml-[var(--sidebar-width-collapsed)]'
                )}>
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
