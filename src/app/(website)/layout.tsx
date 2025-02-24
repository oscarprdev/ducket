import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '~/components/ui/toaster';
import { Footer } from '~/components/website/footer';
import { Header } from '~/components/website/header';
import { auth } from '~/server/auth';
import '~/styles/globals.css';

export const metadata: Metadata = {
  title: 'Ducket',
  description:
    'Ducket is a simple file storage application that allows you to store files in the cloud.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Header userId={userId} />
          {children}
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
