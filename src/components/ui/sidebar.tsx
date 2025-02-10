'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { cn } from '~/lib/utils';

const SidebarContext = React.createContext<{ collapsed: boolean }>({ collapsed: false });

export function Sidebar({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <TooltipProvider>
        <div className={cn('relative', className)}>
          <div
            className={cn(
              'group/sidebar relative flex h-[calc(100vh-4rem)] flex-col gap-4 border-r border-r-white/10 bg-background text-white transition-all duration-300',
              collapsed ? 'w-16' : 'w-64'
            )}>
            {children}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-background text-white hover:bg-white/10">
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

export function SidebarItem({
  className,
  icon,
  title,
  href,
}: React.HTMLAttributes<HTMLDivElement> & { icon: React.ReactNode; title: string; href: string }) {
  const { collapsed } = React.useContext(SidebarContext);
  const pathname = usePathname();
  const isActive = pathname === href;

  const content = (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-white/70 transition-colors',
        'border border-transparent hover:border-white/10 hover:bg-white/5 hover:text-white',
        isActive && 'border-white/10 bg-white/5 text-white',
        collapsed ? 'justify-center' : 'justify-start',
        className
      )}>
      <div className="h-5 w-5 flex-shrink-0">{icon}</div>
      {!collapsed && <span className="text-sm font-medium">{title}</span>}
    </div>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

export function SidebarSection({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1 p-4', className)}>{children}</div>;
}
