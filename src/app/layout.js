import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata = {
  title: "El Observatorio - MUDi 2026",
  description: "Digital ecosystem for a University Master's Thesis about creative entrepreneurship.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans bg-[#F9F8F6] text-[#1A1A1A] min-h-screen flex flex-col antialiased`}
      >
        <Providers>
          {/* Minimalist Top Navigation */}
          <header className="fixed top-0 left-0 w-full z-50 bg-[#F9F8F6]/80 backdrop-blur-md border-b border-black/5">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <span className="font-serif text-lg tracking-wide font-semibold text-[#1A1A1A]">
                El Observatorio <span className="text-gray-500 font-sans text-xs ml-2 tracking-widest uppercase">MUDi 2026</span>
              </span>
              <nav className="flex items-center gap-6">
                <Link href="/proyectos" className="hidden sm:block text-sm font-medium hover:opacity-70 transition-opacity">Proyectos</Link>
                <Link href="/equipo" className="hidden sm:block text-sm font-medium hover:opacity-70 transition-opacity">Directorio</Link>
                <button className="bg-[#1A1A1A] text-[#F9F8F6] px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase hover:bg-gray-800 transition-colors">
                  Leer Informe
                </button>
              </nav>
            </div>
          </header>

          <main className="flex-1 w-full pt-16">
            {children}
          </main>

          {/* Minimalist Footer */}
          <footer className="w-full py-8 text-center border-t border-black/5 mt-auto bg-white">
            <p className="text-xs tracking-widest uppercase text-gray-400 font-sans">
              Proyecto: Alicia Alfonso & Emilio Muñoz. MUDi - UCM 2026.
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
