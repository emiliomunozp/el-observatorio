import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import DashboardLayoutWrapper from "@/components/DashboardLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "El Observatorio",
  description: "Digital ecosystem for a University Master's Thesis about creative entrepreneurship.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans antialiased`}
      >
        <Providers>
          <DashboardLayoutWrapper>
            {children}
          </DashboardLayoutWrapper>
        </Providers>

        {/* Fixed Footer */}
        <footer className="fixed bottom-0 w-full p-4 border-t border-slate-200 bg-white/80 backdrop-blur-sm z-50 pointer-events-none">
          <div className="container mx-auto px-4 flex justify-between items-center text-xs tracking-wider uppercase text-slate-500">
            <p className="pointer-events-auto">Proyecto: Alicia Alfonso & Emilio Muñoz.</p>
            <p className="pointer-events-auto">MUDi - UCM 2026.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
