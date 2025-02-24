import { FilesCard } from '../files-card';
import { MonitoringCard } from '../monitoring-card';
import { UsageCard } from '../usage-card';
import { UsersCard } from '../users-card';

export function FeaturesSection() {
  return (
    <section className="relative mx-auto h-full max-w-[1200px] space-y-8 bg-background px-4 py-12">
      <div className="space-y-4">
        <h2 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">Features</h2>
        <p className="mt-5 text-sm text-muted-foreground sm:text-base">
          Ducket is a simple, secure, and easy-to-use file storage solution.
        </p>
      </div>
      <FilesCard />
      <div className="flex h-full flex-col gap-4 md:flex-row">
        <UsersCard />
        <UsageCard />
      </div>
      <MonitoringCard />
    </section>
  );
}
