import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "El Observatorio",
  description: "Digital ecosystem for a University Master's Thesis about creative entrepreneurship.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} bg-neutral-950 text-neutral-50 min-h-screen flex flex-col font-sans antialiased`}
      >
        <main className="flex-grow">
          {children}
        </main>

        {/* Fixed Footer */}
        <footer className="fixed bottom-0 w-full p-4 border-t border-neutral-800 bg-neutral-950/80 backdrop-blur-sm z-50">
          <div className="container mx-auto px-4 flex justify-between items-center text-xs tracking-wider uppercase text-neutral-400">
            <p>Proyecto: Alicia Alfonso & Emilio Muñoz.</p>
            <p>MUDi - UCM 2026.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
