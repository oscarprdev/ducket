import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { QuestionsAccordion } from '~/components/website/community/questions-accordion';

export default function QuestionsPage() {
  return (
    <section className="relative mx-auto mt-12 max-w-[1200px] space-y-4 bg-background px-4 py-8 sm:mt-16 sm:space-y-6 sm:py-10 md:mt-20 md:space-y-8 md:py-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8 lg:px-10">
        <div>
          <h1 className="pointer-events-none text-4xl font-bold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
            Questions
          </h1>
          <p className="max-w-[600px] text-base text-muted-foreground sm:text-lg md:text-xl">
            {`Find answers to common questions about Ducket. Can't find what you're looking for?
            Contact our support team.`}
          </p>
        </div>
      </div>
      <QuestionsAccordion />
      <section className="relative mx-auto mt-10 h-full max-w-[1000px] space-y-8 px-4 py-28">
        <Card className="space-y-4 py-10">
          <CardHeader>
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
                Do you have more questions?
              </h2>
              <p className="mx-auto mt-5 max-w-[60ch] text-pretty text-sm text-muted-foreground sm:text-base">
                {`For now we don't have a support team, but you can propose a feature or ask a question
                in the community proposals section. In the meantime, you can read the documentation or start a trying the platform.`}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mx-auto flex w-full max-w-[500px] flex-col gap-4 sm:flex-row">
              <Button asChild className="flex-1">
                <Link href="/sign-up">Start a project now</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/developers/docs">Read documentation</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </section>
  );
}
