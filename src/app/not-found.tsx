import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import { Illustration, NotFound as NotFoundComponent } from '~/components/shared/not-found';
import '~/styles/globals.css';

export default function NotFound() {
  return (
    <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <div className="relative flex min-h-svh w-full flex-col justify-center bg-background p-6 md:p-10">
            <div className="relative mx-auto w-full max-w-5xl">
              <Illustration className="absolute inset-0 h-[50vh] w-full text-foreground opacity-[0.04] dark:opacity-[0.03]" />
              <NotFoundComponent
                title="Page not found"
                description="Lost, this page is. In another system, it may be."
              />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
