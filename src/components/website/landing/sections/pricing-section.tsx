import { PricingCards, type PricingTier } from '../../pricing-carts';

export function PricingSection() {
  const tiers: PricingTier[] = [
    {
      name: 'Beta',
      price: 0,
      description: 'For everyone during beta',
      features: [
        { name: 'Up to 10 projects', included: true },
        { name: '5MB max file size', included: true, highlight: true },
        { name: 'Up to 1GB for each project', included: true, highlight: true },
        { name: 'Analytics up to 30 days', included: true, highlight: true },
        { name: 'Multiple users', included: true },
      ],
      cta: {
        text: 'Try it now',
        href: '/sign-up',
      },
    },
  ];

  return (
    <section className="relative mx-auto mt-10 h-full max-w-[1000px] space-y-8 px-4 py-28">
      <div className="space-y-4">
        <h2 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">Pricing</h2>
        <p className="mt-5 text-sm text-muted-foreground sm:text-base">
          All features are free during beta.
        </p>
      </div>

      <PricingCards tiers={tiers} />
    </section>
  );
}
