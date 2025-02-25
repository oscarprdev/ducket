'use client';

import {
  Activity,
  Book,
  CircleHelp,
  DatabaseZap,
  File,
  Github,
  HandHelping,
  Route,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import React, { type ReactNode, useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '~/components/ui/navigation-menu';
import { cn } from '~/lib/utils';

type HeaderNavItem = { title: string; href: string; description: string; icon: ReactNode };

interface HeaderNavProps {
  userId?: string;
  isMobile?: boolean;
}

export function HeaderNav({ userId, isMobile }: HeaderNavProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const features: HeaderNavItem[] = [
    {
      title: 'Files',
      href: '/features/files',
      icon: <File size={18} />,
      description: 'Know more about how to manage your files.',
    },
    {
      title: 'Users',
      href: '/features/users',
      icon: <Users size={18} />,
      description: 'Share files with your team.',
    },
    {
      title: 'Usage',
      href: '/features/usage',
      icon: <DatabaseZap size={18} />,
      description: 'Track your usage.',
    },
    {
      title: 'Monitoring',
      href: '/features/monitoring',
      icon: <Activity size={18} />,
      description: 'Monitor your project activiy logs.',
    },
  ];

  const community: HeaderNavItem[] = [
    {
      title: 'Roadmap',
      href: '/community/roadmap',
      icon: <Route size={18} />,
      description: 'See what we are working on',
    },
    {
      title: 'Proposals',
      href: '/community/proposals',
      icon: <HandHelping size={18} />,
      description: 'Propose new features',
    },
    {
      title: 'Questions',
      href: '/community/questions',
      icon: <CircleHelp size={18} />,
      description: 'Ask questions and get answers',
    },
  ];

  const developers: HeaderNavItem[] = [
    {
      title: 'Documentation',
      href: '/developers/docs',
      icon: <Book size={18} />,
      description: 'Learn how to use the API',
    },
    {
      title: 'Github',
      href: 'https://github.com/ducket-dev/ducket',
      icon: <Github size={18} />,
      description: 'Contribute to the project',
    },
  ];

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="space-y-4">
          <div>
            <button
              onClick={() => setActiveSection(activeSection === 'features' ? null : 'features')}
              className="flex w-full items-center justify-between py-2 text-sm">
              Features
            </button>
            {activeSection === 'features' && (
              <div className="ml-4 mt-2 flex flex-col gap-2">
                {features.map(item => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-center gap-2 rounded-md p-2 text-sm text-muted-foreground hover:bg-muted">
                    {item.icon}
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setActiveSection(activeSection === 'community' ? null : 'community')}
              className="flex w-full items-center justify-between py-2 text-sm">
              Community
            </button>
            {activeSection === 'community' && (
              <div className="ml-4 mt-2 flex flex-col gap-2">
                {community.map(item => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-center gap-2 rounded-md p-2 text-sm text-muted-foreground hover:bg-muted">
                    {item.icon}
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setActiveSection(activeSection === 'developers' ? null : 'developers')}
              className="flex w-full items-center justify-between py-2 text-sm">
              Developers
            </button>
            {activeSection === 'developers' && (
              <div className="ml-4 mt-2 flex flex-col gap-2">
                {developers.map(item => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-center gap-2 rounded-md p-2 text-sm text-muted-foreground hover:bg-muted">
                    {item.icon}
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {!userId ? (
          <Button asChild className="w-full">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        ) : (
          <Button asChild className="w-full">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-sm hover:bg-transparent">
            Features
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-[500px] flex-col gap-3 p-4">
              {features.map(component => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  icon={component.icon}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-sm hover:bg-transparent">
            Community
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-[500px] flex-col gap-3 p-4">
              {community.map(component => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  icon={component.icon}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-sm hover:bg-transparent">
            Developers
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-[500px] flex-col gap-3 p-4">
              {developers.map(component => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  icon={component.icon}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {!userId ? (
          <Link
            href="/sign-in"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground duration-300 hover:bg-primary/80">
            Sign in
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground duration-300 hover:bg-primary/80">
            Dashboard
          </Link>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { icon: ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md border border-transparent p-3 leading-none text-muted-foreground no-underline outline-none transition-colors hover:border-border hover:bg-muted hover:text-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}>
          <div className="flex items-center gap-2 text-sm font-medium leading-none text-primary">
            {icon}
            {title}
          </div>
          <p className="line-clamp-2 pl-[1.6rem] text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
