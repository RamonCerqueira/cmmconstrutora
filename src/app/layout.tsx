import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SplashScreen from '@/components/SplashScreen';
import { getSessionUser } from '@/lib/auth';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const manrope = Manrope({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CMM Construtora | Construindo o Futuro com Excelência',
  description:
    'Líder nacional em engenharia e construções de alto padrão. Projetos, soluções e infraestrutura completa para obras públicas e privadas.',
  keywords: [
    'construtora',
    'incorporadora',
    'obras públicas',
    'obras privadas',
    'engenharia civil',
    'infraestrutura',
    'cmm construtora',
  ],
  authors: [{ name: 'CMM Construtora' }],
  openGraph: {
    title: 'CMM Construtora | Construindo o Futuro com Excelência',
    description:
      'Soluções completas e inovadoras para obras civis de infraestrutura públicas e privadas. Qualidade, segurança e compromisso.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'CMM Construtora',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Retrieve the session user directly on the server to prevent dynamic layout flashes on page loads
  const user = await getSessionUser();

  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${manrope.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-light text-secondary">
        {/* Splash screen animation for loading state */}
        <SplashScreen />

        {/* Global Navigation Navbar */}
        <Navbar user={user} />

        {/* Page Content */}
        <main className="flex-grow">{children}</main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
