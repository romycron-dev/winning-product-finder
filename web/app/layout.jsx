import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Winning Product Finder',
  description:
    'Discover high-margin, low-competition products across Indian marketplaces.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100">
            <header className="border-b bg-white/70 backdrop-blur">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <h1 className="text-2xl font-semibold text-brand">
                  Winning Product Finder
                </h1>
                <nav className="flex gap-4 text-sm font-medium">
                  <a href="/" className="text-slate-700 hover:text-brand">
                    Search
                  </a>
                  <a href="/saved" className="text-slate-700 hover:text-brand">
                    Saved Searches
                  </a>
                </nav>
              </div>
            </header>
            <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

