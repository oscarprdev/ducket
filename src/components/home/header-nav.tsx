import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../ui/navigation-menu';
import {
  Activity,
  Book,
  CircleHelp,
  DatabaseZap,
  File,
  Github,
  HandHelping,
  Info,
  Mail,
  Route,
  ShieldHalf,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import React, { type ReactNode } from 'react';
import { cn } from '~/lib/utils';

type HeaderNavItem = { title: string; href: string; description: string; icon: ReactNode };

export function HeaderNav() {
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
      href: '/developers/documentation',
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

  const about: HeaderNavItem[] = [
    {
      title: 'Team',
      href: '/about/team',
      icon: <ShieldHalf size={18} />,
      description: 'Team behind Ducket',
    },
    {
      title: 'Contact',
      href: '/about/contact',
      icon: <Mail size={18} />,
      description: 'Contact us',
    },
  ];
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-sm hover:bg-transparent">
            Features
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-[200px] flex-col gap-3 p-4 md:w-[500px] lg:w-[300px]">
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
            <ul className="flex w-[200px] flex-col gap-3 p-4 md:w-[500px] lg:w-[300px]">
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
            <ul className="flex w-[200px] flex-col gap-3 p-4 md:w-[500px] lg:w-[300px]">
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
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-sm hover:bg-transparent">
            About
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-[200px] flex-col gap-3 p-4 md:w-[500px] lg:w-[300px]">
              {about.map(component => (
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
        <Link
          href="/sign-in"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground duration-300 hover:bg-primary/80">
          Sign in
        </Link>
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
