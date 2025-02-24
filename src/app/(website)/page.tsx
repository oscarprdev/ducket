import { Header } from '~/components/website/header';
import { CommunitySection } from '~/components/website/landing/sections/community-section';
import { DeveloperSection } from '~/components/website/landing/sections/developer-section';
import { FeaturesSection } from '~/components/website/landing/sections/features-section';
import { HeroSection } from '~/components/website/landing/sections/hero-section';
import { PricingSection } from '~/components/website/landing/sections/pricing-section';
import { TryNowSection } from '~/components/website/landing/sections/try-now-section';
import { auth } from '~/server/auth';

export default async function HomePage() {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <>
      <Header userId={userId} />
      <HeroSection />
      <CommunitySection />
      <FeaturesSection />
      <PricingSection />
      <DeveloperSection />
      <TryNowSection />
    </>
  );
}
