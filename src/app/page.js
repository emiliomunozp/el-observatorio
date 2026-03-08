'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, BarChart3, TrendingDown, Layers, Target, Activity } from 'lucide-react';
import useStore from '../store/useStore';
import HeroSimulation from '../components/HeroSimulation';

const SCENE_CONTENT = [
  {
    title: "El Ecosistema Inestable: La fricción estructural.",
    callout: "70%",
    calloutText: "de los proyectos creativos fracasan por mala gestión administrativa.",
    icon: Activity
  },
  {
    title: "Los Puntos de Dolor: Parálisis y Dispersión.",
    callout: "294€",
    calloutText: "Cuota de autónomos mensual ignorando los ingresos reales.",
    icon: Layers
  },
  {
    title: "El Muro: El 95% sufre analfabetismo fiscal al graduarse.",
    callout: "95%",
    calloutText: "de los estudiantes de creatividad desconocen cómo emitir una factura legal.",
    icon: TrendingDown
  },
  {
    title: "Design Thinking: Diseñar para el cambio, no por azar.",
    callout: "Data-Driven",
    calloutText: "Decisiones iterativas basadas en métricas reales de los propios alumnos.",
    icon: Target
  },
  {
    title: "La Solución: La Junior Empresa como parachoques administrativo.",
    callout: "0€",
    calloutText: "Fugas fiscales iniciales. 100% del ecosistema protegido institucionalmente.",
    icon: BarChart3
  }
];

const SceneCard = ({ content, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });
  const setCurrentScrollScene = useStore(state => state.setCurrentScrollScene);
  const Icon = content.icon;

  useEffect(() => {
    if (isInView) {
      setCurrentScrollScene(index);
    }
  }, [isInView, index, setCurrentScrollScene]);

  return (
    <section
      ref={ref}
      className="min-h-[120vh] flex items-center justify-center relative z-10 p-4 lg:p-12 pointer-events-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, margin: "-10%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl w-full bg-black/60 backdrop-blur-xl border border-white/10 p-8 md:px-16 md:py-20 pointer-events-auto shadow-2xl rounded-2xl flex flex-col md:flex-row gap-12 items-center"
      >
        {/* Left Side: Brutalist Typography */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6 md:mb-10 text-neutral-400">
            <span className="text-xl md:text-2xl tracking-[0.2em] font-black uppercase text-white/50">
              0{index + 1}
            </span>
            <div className="h-px bg-white/20 flex-grow"></div>
            <Icon className="w-8 h-8 text-white/30" />
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.9] text-white balance-text">
            {content.title}
          </h2>
        </div>

        {/* Right Side: Data Callout Sparkline */}
        <div className="md:w-1/3 flex border-l border-white/10 pl-10 items-center justify-center">
          <div className="text-center md:text-left">
            <span className={`block text-6xl md:text-8xl font-black mb-4 tracking-tighter ${index === 2 ? 'text-red-500' : 'text-[#00ff99]'}`}>
              {content.callout}
            </span>
            <p className="text-neutral-400 text-sm md:text-base font-medium uppercase tracking-widest leading-relaxed">
              {content.calloutText}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default function Home() {
  return (
    <div className="relative w-full overflow-hidden bg-neutral-950 font-sans">

      {/* SaaS Glassmorphism Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-white text-black flex items-center justify-center font-black text-xl">
            O
          </div>
          <span className="text-white font-bold tracking-widest uppercase text-sm">El Observatorio</span>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 bg-[#00ff99] text-black px-5 py-2.5 rounded-full font-bold uppercase text-xs tracking-wider hover:bg-white transition-colors"
        >
          Acceder al Dashboard <ArrowRight className="w-4 h-4" />
        </Link>
      </nav>

      {/* Immersive D3 Background */}
      <div className="fixed inset-0 z-0">
        <HeroSimulation />
      </div>

      {/* Scrollable Foreground Container */}
      <div className="relative z-10 pb-[10vh] pointer-events-none pt-24">
        {SCENE_CONTENT.map((content, i) => (
          <SceneCard key={i} content={content} index={i} />
        ))}
      </div>

      {/* Huge Bottom CTA */}
      <div className="relative z-10 flex flex-col items-center justify-center pb-40 pt-20 px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="pointer-events-auto text-center"
        >
          <Link
            href="/simulador"
            className="group inline-flex items-center justify-center gap-4 bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.3)] px-12 py-8 rounded-full hover:scale-105 transition-all duration-300"
          >
            <span className="font-black uppercase tracking-[0.2em] text-xl md:text-2xl">
              Probar el Simulador
            </span>
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
              <ArrowRight className="w-6 h-6" />
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
