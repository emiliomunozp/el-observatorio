'use client';

import React, { useState } from 'react';
import SankeyChart from '../../components/SankeyChart';

export default function SimuladorPage() {
    const [service, setService] = useState('Branding');
    const [budget, setBudget] = useState(1500);

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen">
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-light mb-4">La Fricción Fiscal</h1>
                <p className="text-neutral-400 text-lg max-w-2xl">
                    Compara el impacto de la carga impositiva sobre un encargo profesional en el modelo tradicional (Autónomo) frente al modelo de transición (Junior Empresa).
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Interactive Form */}
                <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 p-8 rounded-sm self-start sticky top-24">
                    <h2 className="text-xl font-semibold mb-6 uppercase tracking-wider text-neutral-300">Simula un encargo</h2>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="service" className="block text-sm font-medium text-neutral-400 mb-2">
                                Tipo de Servicio
                            </label>
                            <select
                                id="service"
                                value={service}
                                onChange={(e) => setService(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-700 rounded-sm px-4 py-3 text-neutral-100 focus:outline-none focus:border-neutral-500 transition-colors"
                            >
                                <option value="Branding">Branding Integral</option>
                                <option value="Illustration">Ilustración / Arte Conceptual</option>
                                <option value="Web">Desarrollo Web</option>
                                <option value="Consulting">Consultoría Creativa</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="budget" className="block text-sm font-medium text-neutral-400 mb-2">
                                Presupuesto Total (€)
                            </label>
                            <div className="flex items-center space-x-4">
                                <input
                                    id="budget"
                                    type="range"
                                    min="300"
                                    max="5000"
                                    step="50"
                                    value={budget}
                                    onChange={(e) => setBudget(Number(e.target.value))}
                                    className="w-full accent-neutral-500"
                                />
                                <span className="text-xl font-mono text-neutral-200 min-w-[80px] text-right">
                                    {budget} €
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-neutral-800">
                        <p className="text-xs text-neutral-500 leading-relaxed">
                            * Datos calculados en base a una simulación teórica sobre la base imponible y el IRPF/IVA general para un creativo en España. Cuota de autónomos fijada en tramo medio estándar.
                        </p>
                    </div>
                </div>

                {/* Right Column: D3 Sankey Diagram */}
                <div className="lg:col-span-8 bg-neutral-900 p-4 border border-neutral-800 rounded-sm h-[600px] flex flex-col">
                    <h3 className="text-sm font-medium text-neutral-400 mb-6 px-4 uppercase tracking-widest">
                        Flujo de Capital: Autónomo vs Junior Empresa
                    </h3>
                    <div className="flex-grow w-full">
                        <SankeyChart budget={budget} />
                    </div>
                </div>
            </div>
        </div>
    );
}
