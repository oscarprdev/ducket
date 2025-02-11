import { Header } from './header';
import { cn } from '~/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
}

export default function DashboardLayout({ children, sidebarContent }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header className="fixed left-0 right-0 top-0 z-50 border-b" />
      <div className="flex flex-1 pt-16">
        <div className="fixed bottom-0 left-0 top-16">{sidebarContent}</div>
        <main
          className={cn(
            'ml-[var(--sidebar-width)] flex-1 overflow-y-auto p-6 transition-[margin]',
            'data-[collapsed=true]:ml-[var(--sidebar-width-collapsed)]'
          )}>
          {children}
        </main>
      </div>
    </div>
  );
}
