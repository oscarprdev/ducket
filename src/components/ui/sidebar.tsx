'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { cn } from '~/lib/utils';

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => undefined,
});

export function Sidebar({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', collapsed ? '4rem' : '16rem');
    document.documentElement.style.setProperty(
      '--sidebar-width-collapsed',
      collapsed ? '4rem' : '16rem'
    );
  }, [collapsed]);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <TooltipProvider>
        <div
          className={cn(
            'relative h-[calc(100vh-4rem)] w-[var(--sidebar-width)] border-r border-border transition-all',
            className
          )}
          data-collapsed={collapsed}>
          <div className={cn('flex h-full w-full flex-col gap-4 overflow-y-auto py-2')}>
            {children}
          </div>
          <button
            onClick={() => setCollapsed(c => !c)}
            className={cn(
              'absolute -right-4 top-7 flex h-8 w-8 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm hover:text-foreground'
            )}>
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
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
  const { collapsed } = useContext(SidebarContext);
  const pathname = usePathname();
  const isActive = pathname === href;

  const content = (
    <div
      className={cn(
        'flex w-full items-center gap-3 rounded-md px-3 py-2 transition-colors',
        'border border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground',
        isActive && 'border-border bg-muted text-foreground',
        collapsed ? 'justify-start' : 'justify-start',
        className
      )}>
      <div className="h-5 w-5 flex-shrink-0">{icon}</div>
      <span className="w-full text-nowrap text-sm font-medium">{!collapsed && title}</span>
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
  return (
    <div className={cn('flex w-full flex-col items-start gap-1 p-2 pt-4', className)}>
      {children}
    </div>
  );
}
