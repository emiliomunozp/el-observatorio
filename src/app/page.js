'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { getDashboardMetrics } from '@/services/dataPipeline';
import SankeyChart from '@/components/SankeyChart';

export default function Home() {
  const [data, setData] = useState({
    illiteracy: 0,
    preincubatorNonUsers: 0,
    fears: []
  });
  const [activeStep, setActiveStep] = useState(0);
  const sectionRefs = useRef([]);

  const [baseBudget, setBaseBudget] = useState(1000); // For Simulator

  useEffect(() => {
    async function initData() {
      try {
        const metrics = await getDashboardMetrics();
        setData({
          illiteracy: metrics.fiscalIlliteracy,
          preincubatorNonUsers: metrics.preincubatorNonUsers,
          fears: metrics.fears
        });
      } catch (err) {
        console.error(err);
      }
    }
    initData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStep(Number(entry.target.dataset.step));
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );

    const currentRefs = sectionRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const renderChart = () => {
    if (activeStep === 0) {
      const ineData = [
        { name: 'STEM', empleo: 85 },
        { name: 'Artes/Humanidades', empleo: 45 },
        { name: 'Salud', empleo: 92 },
      ];
      return (
        <div key="step0" className="w-full h-96 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
          <h3 className="text-sm font-sans uppercase tracking-widest text-gray-500 mb-6 text-center">Tasa de Inserción Laboral por Rama (Mock INE)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ineData} layout="vertical" margin={{ left: 40, right: 20 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#666' }} width={120} />
              <Tooltip cursor={{ fill: '#f0f0f0' }} contentStyle={{ borderRadius: '0px', border: '1px solid #1a1a1a' }} />
              <Bar dataKey="empleo" fill="#1A1A1A" barSize={32} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    } else if (activeStep === 1) {
      const donutData = [
        { name: 'Evitan/Desconocen Obligaciones', value: data.illiteracy || 95 },
        { name: 'Gestión Fluida', value: 100 - (data.illiteracy || 95) }
      ];
      const COLORS = ['#D32F2F', '#E5E5E5'];
      return (
        <div key="step1" className="w-full h-[400px] opacity-0 animate-[fadeIn_0.5s_ease-out_forwards] relative flex flex-col items-center">
          <h3 className="text-sm font-sans uppercase tracking-widest text-gray-500 mb-4 text-center">Nivel de Analfabetismo Fiscal</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={donutData} cx="50%" cy="50%" innerRadius={100} outerRadius={140} paddingAngle={2} dataKey="value" stroke="none">
                {donutData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} contentStyle={{ borderRadius: '0px', border: '1px solid #1a1a1a' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center mt-2">
            <span className="text-6xl font-serif text-[#D32F2F] tracking-tighter">{data.illiteracy}%</span>
          </div>
        </div>
      );
    } else if (activeStep === 2) {
      const donutData = [
        { name: 'Espacio Desaprovechado', value: data.preincubatorNonUsers || 87 },
        { name: 'Potencial Extraído', value: 100 - (data.preincubatorNonUsers || 87) }
      ];
      const COLORS = ['#94A3B8', '#1A1A1A'];
      return (
        <div key="step2" className="w-full h-[400px] opacity-0 animate-[fadeIn_0.5s_ease-out_forwards] relative flex flex-col items-center">
          <h3 className="text-sm font-sans uppercase tracking-widest text-gray-500 mb-4 text-center">Fricción de Infraestructura (AS009)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={donutData} cx="50%" cy="50%" innerRadius={80} outerRadius={140} paddingAngle={2} dataKey="value" stroke="none">
                {donutData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} contentStyle={{ borderRadius: '0px', border: '1px solid #1a1a1a' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center mt-2">
            <span className="text-6xl font-serif text-[#1A1A1A] tracking-tighter">{data.preincubatorNonUsers}%</span>
          </div>
        </div>
      );
    } else {
      return (
        <div key="step3" className="w-full text-center flex flex-col items-center justify-center h-full opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
          <h2 className="text-3xl font-serif text-gray-400 mb-4">El Cambio de Paradigma</h2>
          <p className="text-gray-500 font-sans max-w-sm">La Junior Empresa permite testear el mercado en un entorno seguro antes de saltar al abismo del trabajo autónomo.</p>
        </div>
      )
    }
  };

  return (
    <div className="w-full">
      {/* Scrollytelling Container */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 relative">

        {/* Left Column (Narrative) */}
        <div className="col-span-1 py-12">

          <section ref={el => { if (el) sectionRefs.current[0] = el; }} data-step="0" className="min-h-[90vh] flex flex-col justify-center mb-16">
            <p className="text-sm tracking-widest uppercase text-gray-400 mb-4 font-sans">Acto 1</p>
            <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-6">El Ecosistema</h2>
            <p className="text-lg text-gray-700 leading-relaxed font-sans mb-6">
              Los egresados de disciplinas creativas se enfrentan a un mercado laboral radicalmente distinto al de las carreras STEM. La precariedad estructural y la intermitencia de los encargos definen sus primeros años.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed font-sans">
              Mientras otras disciplinas tienen caminos pavimentados hacia la empresa tradicional, el diseñador se ve abocado, casi de manera forzosa, a la figura del trabajador autónomo.
            </p>
          </section>

          <section ref={el => { if (el) sectionRefs.current[1] = el; }} data-step="1" className="min-h-[90vh] flex flex-col justify-center mb-16">
            <p className="text-sm tracking-widest uppercase text-gray-400 mb-4 font-sans">Acto 2</p>
            <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-6">El Analfabetismo</h2>
            <p className="text-lg text-gray-700 leading-relaxed font-sans mb-6">
              A pesar de que el marco laboral les empuja al trabajo por cuenta propia, la formación académica ignora casi por completo las herramientas fiscales, legales y de gestión empresarial.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed font-sans font-medium">
              Estar preparado para diseñar no significa estar preparado para vivir del diseño.
            </p>
          </section>

          <section ref={el => { if (el) sectionRefs.current[2] = el; }} data-step="2" className="min-h-[90vh] flex flex-col justify-center mb-16">
            <p className="text-sm tracking-widest uppercase text-gray-400 mb-4 font-sans">Acto 3</p>
            <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-6">La Preincubadora</h2>
            <p className="text-lg text-gray-700 leading-relaxed font-sans mb-6">
              La Facultad dispone de infraestructuras pioneras como el espacio AS009, diseñado específicamente para servir de &quot;sandbox&quot; o preincubadora de ideas creativas. Sin embargo, su conexión con la docencia y el alumnado está quebrada.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed font-sans">
              La desconexión genera un vacío: un espacio con potencial asombroso que respira inactividad.
            </p>
          </section>

          <section ref={el => { if (el) sectionRefs.current[3] = el; }} data-step="3" className="min-h-[90vh] flex flex-col justify-center mb-10">
            <p className="text-sm tracking-widest uppercase text-gray-400 mb-4 font-sans">Acto 4</p>
            <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-6">La Solución</h2>
            <p className="text-lg text-gray-700 leading-relaxed font-sans mb-6">
              Reconfigurar el sistema requiere algo más que buenas intenciones. Exige una estructura puente que amortigüe el impacto económico del primer encargo real.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed font-sans">
              El Observatorio Junior Empresa se postula como esa red de seguridad administrativa y legal.
            </p>
          </section>

        </div>

        {/* Right Column (Sticky Visuals) */}
        <div className="col-span-1 hidden md:block">
          <div className="sticky top-0 h-screen flex flex-col justify-center items-center p-8">
            {renderChart()}
          </div>
        </div>
      </div>

      {/* Simulator Section */}
      <section className="min-h-screen bg-white py-24 border-t border-black/5 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-4">Calcula tu propio impacto</h2>
          <p className="text-lg text-gray-500 font-sans max-w-2xl mx-auto">
            ¿Qué pasaría si hoy consiguieras tu primer encargo freelance de 1.000€? La fuga de capital administrativa penaliza al diseñador novato.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="mb-10 max-w-sm mx-auto">
            <label className="block text-sm font-sans uppercase tracking-widest text-gray-400 mb-2 text-center">
              Valor de tu Encargo Base
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-serif text-xl">€</span>
              <input
                type="number"
                value={baseBudget}
                onChange={(e) => setBaseBudget(Number(e.target.value) > 0 ? Number(e.target.value) : 0)}
                className="w-full pl-10 pr-4 py-4 bg-gray-50 border-b-2 border-gray-200 text-center text-3xl font-serif text-[#1A1A1A] focus:outline-none focus:border-black transition-colors"
                min="0"
                step="50"
              />
            </div>
          </div>

          <div className="bg-[#F9F8F6] p-8 rounded-xl border border-black/5 shadow-sm">
            <SankeyChart budget={baseBudget} />
          </div>
        </div>
      </section>

    </div>
  );
}
