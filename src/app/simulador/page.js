'use client';

import React, { useState } from 'react';
import Chart from 'react-google-charts';
import { Calculator, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SimuladorPage() {
    const [baseBudget, setBaseBudget] = useState(1000);

    // Constants
    const IRPF_RATE = 0.15;
    const AUTONOMOS_CUOTA = 294; // Simplified fixed minimum quota

    // Freelance Calculations
    const irpfDeduction = baseBudget * IRPF_RATE;
    const netFreelance = baseBudget - irpfDeduction - AUTONOMOS_CUOTA;

    // Junior Enterprise Calculations
    // 100% goes to the student's project/materials fund (Bolsa de Horas)
    const netJuniorEnterprise = baseBudget;

    const handleBudgetChange = (e) => {
        const val = Number(e.target.value);
        setBaseBudget(val > 0 ? val : 0);
    };

    // Google Charts Sankey Data Format
    // Header row is required
    const sankeyData = [
        ["De", "A", "Valor (€)"],
        // Freelance Flow
        ["Presupuesto Cliente", "Vía Autónomo", baseBudget],
        ["Vía Autónomo", "IRPF (15%)", irpfDeduction],
        ["Vía Autónomo", "Cuota Autónomos", AUTONOMOS_CUOTA],
        ["Vía Autónomo", "Beneficio Neto (Para ti)", Math.max(0, netFreelance)], // Prevent negative rendering errors

        // Junior Enterprise Flow
        ["Presupuesto Cliente", "Vía Junior Empresa", baseBudget],
        ["Vía Junior Empresa", "Bolsa de Materiales / Formación", netJuniorEnterprise],
    ];

    const chartOptions = {
        sankey: {
            node: {
                colors: ['#475569', '#ef4444', '#f87171', '#fca5a5', '#dc2626', '#10b981', '#34d399'],
                nodePadding: 40,
                label: {
                    fontName: 'Inter, sans-serif',
                    fontSize: 14,
                    color: '#1e293b',
                    bold: true
                }
            },
            link: {
                colorMode: 'gradient',
                colors: ['#e2e8f0']
            }
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen pb-24 bg-slate-50 font-sans text-slate-900">

            <div className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2 flex items-center gap-3">
                    <Calculator className="w-8 h-8 text-blue-600" />
                    Simulador Fiscal
                </h1>
                <p className="text-slate-500 text-lg">Compara la fuga de capital de un encargo real: Autónomo vs Junior Empresa.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Input & Summary Sidebar */}
                <div className="col-span-1 flex flex-col gap-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                            Introduce el presupuesto de tu encargo (€)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">€</span>
                            <input
                                type="number"
                                value={baseBudget}
                                onChange={handleBudgetChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                min="0"
                                step="50"
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Calculado sin IVA, asumiendo base imponible.</p>
                    </div>

                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-red-600 font-semibold mb-4 text-sm uppercase tracking-wider">
                            <AlertTriangle className="w-5 h-5" />
                            Escenario Autónomo
                        </div>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Base:</span>
                                <span className="font-medium">{baseBudget}€</span>
                            </div>
                            <div className="flex justify-between text-sm text-red-500/80">
                                <span>IRPF (15%):</span>
                                <span>-{irpfDeduction.toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between text-sm text-red-500/80">
                                <span>Cuota Mínima:</span>
                                <span>-{AUTONOMOS_CUOTA}€</span>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-red-200">
                            <p className="text-sm font-semibold text-red-800 mb-1">Beneficio Líquido Real</p>
                            <p className="text-5xl font-black text-red-600 tracking-tighter">
                                {netFreelance < 0 ? 0 : netFreelance.toFixed(2)}<span className="text-2xl text-red-400">€</span>
                            </p>
                            {netFreelance < 0 && (
                                <p className="text-xs text-red-500 mt-2 font-medium">¡Estás perdiendo dinero por facturar!</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-4 text-sm uppercase tracking-wider">
                            <CheckCircle2 className="w-5 h-5" />
                            Escenario Junior Empresa
                        </div>
                        <div className="pt-2">
                            <p className="text-sm font-semibold text-emerald-800 mb-1">Bolsa de Materiales / Formación</p>
                            <p className="text-5xl font-black text-emerald-600 tracking-tighter">
                                {netJuniorEnterprise.toFixed(2)}<span className="text-2xl text-emerald-400">€</span>
                            </p>
                            <p className="text-xs text-emerald-600/80 mt-2 font-medium">100% de retorno al estudiante mediante la asociación.</p>
                        </div>
                    </div>

                </div>

                {/* Sankey Chart Area */}
                <div className="col-span-1 lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Flujo de Capital</h2>
                        <p className="text-sm text-slate-500">Visualización de fugas administrativas.</p>
                    </div>
                    <div className="flex-1 w-full min-h-[500px]">
                        <Chart
                            chartType="Sankey"
                            width="100%"
                            height="100%"
                            data={sankeyData}
                            options={chartOptions}
                            loader={
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                                </div>
                            }
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
