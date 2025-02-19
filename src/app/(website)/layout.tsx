import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Header } from '~/components/home/header';
import { Toaster } from '~/components/ui/toaster';
import '~/styles/globals.css';

export const metadata: Metadata = {
  title: 'Ducket',
  description:
    'Ducket is a simple file storage application that allows you to store files in the cloud.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
