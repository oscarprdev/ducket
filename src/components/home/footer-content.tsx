import Link from 'next/link';
import React from 'react';

const features = [
  {
    name: 'Files',
    href: '/features/files',
  },
  {
    name: 'Users',
    href: '/features/users',
  },
  {
    name: 'Usage',
    href: '/features/usage',
  },
  {
    name: 'Monitoring',
    href: '/features/monitoring',
  },
];

const community = [
  {
    name: 'Roadmap',
    href: '/community/roadmap',
  },
  {
    name: 'Proposals',
    href: '/community/proposals',
  },
  {
    name: 'Questions',
    href: '/community/questions',
  },
];

const developers = [
  {
    name: 'Documentation',
    href: '/developers/documentation',
  },
  {
    name: 'Github',
    href: 'https://github.com/ducket-io',
  },
];

const about = [
  {
    name: 'Team',
    href: '/about/team',
  },

  {
    name: 'Contact',
    href: '/about/contact',
  },
];

const nav = [
  {
    name: 'Features',
    items: features,
  },
  {
    name: 'Community',
    items: community,
  },
  {
    name: 'Developers',
    items: developers,
  },
  {
    name: 'About',
    items: about,
  },
];

export default function FooterContent() {
  return (
    <div className="flex h-full w-full flex-col justify-between bg-muted/90 px-12 py-8">
      <Nav />
      <div className="relative flex items-end justify-between">
        <h6 className="absolute -bottom-20 right-0 text-[14vw] font-bold leading-[0.8] text-muted-foreground/30">
          DUCKET
        </h6>
      </div>
    </div>
  );
}

const Nav = () => {
  return (
    <div className="flex shrink-0 gap-20">
      {nav.map(items => (
        <div key={items.name} className="flex flex-col gap-2">
          <h3 className="mb-2 uppercase text-primary">{items.name}</h3>
          {items.items.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className="cursor-pointer text-muted-foreground duration-300 hover:text-primary">
              {item.name}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};
