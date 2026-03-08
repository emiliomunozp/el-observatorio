'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import useStore from '../store/useStore';

const scenes = [
  "El Ecosistema Inestable: La fricción estructural.",
  "Los Puntos de Dolor: Parálisis y Dispersión.",
  "El Muro: El 95% sufre analfabetismo fiscal al graduarse.",
  "Design Thinking: Diseñar para el cambio, no por azar.",
  "La Solución: La Junior Empresa como parachoques administrativo."
];

const SceneCard = ({ text, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });
  const setCurrentScrollScene = useStore(state => state.setCurrentScrollScene);

  useEffect(() => {
    if (isInView) {
      setCurrentScrollScene(index);
    }
  }, [isInView, index, setCurrentScrollScene]);

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center relative z-10 p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-20%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl w-full bg-neutral-900/60 p-8 md:p-12 border border-neutral-800 backdrop-blur-md rounded-sm"
      >
        <h2 className="text-3xl md:text-5xl font-light leading-tight text-neutral-100">
          <span className="text-neutral-500 block mb-4 text-sm tracking-widest uppercase font-bold">Escena {index}</span>
          {text}
        </h2>
      </motion.div>
    </section>
  );
};

export default function Home() {
  return (
    <div className="relative w-full">
      {/* Fixed Background Container for D3 Canvas */}
      <div className="fixed inset-0 z-0 bg-neutral-950 flex items-center justify-center">
        {/* D3 visualizations will go here */}
      </div>

      {/* Scrollable Foreground */}
      <div className="relative z-10 pb-[10vh]">
        {scenes.map((text, i) => (
          <SceneCard key={i} text={text} index={i} />
        ))}
      </div>

      {/* Navigation block to next section */}
      <div className="relative z-10 flex justify-center pb-32">
        <Link
          href="/simulador"
          className="bg-neutral-100 text-neutral-900 px-8 py-4 rounded-sm hover:bg-neutral-300 font-semibold uppercase tracking-widest text-sm transition-colors"
        >
          Acceder al Simulador Fiscal
        </Link>
      </div>
    </div>
  );
}
