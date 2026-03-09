'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { getDashboardMetrics } from '@/services/dataPipeline';
import { AlertTriangle, Info } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState({
    illiteracy: 0,
    preincubatorNonUsers: 0,
    fears: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError("Error loading dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600 bg-red-50 border border-red-200 rounded-lg m-8">
        {error}
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#e2e8f0']; // Blue for unused, Light gray for used
  const donutData = [
    { name: 'Desconocen/No usan', value: data.preincubatorNonUsers },
    { name: 'Usuario Activo', value: 100 - data.preincubatorNonUsers }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen pb-24 font-sans text-slate-900 bg-slate-50">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Observatorio Estratégico</h1>
        <p className="text-slate-500 text-lg">Métricas clave de fricción estructural en el ecosistema emprendedor.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Card 1: KPI Illiteracy */}
        <div className="col-span-1 bg-white border border-slate-200 rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 text-red-600 font-semibold mb-4 text-sm uppercase tracking-wider">
            <AlertTriangle className="w-5 h-5" />
            Fricción Estructural
          </div>
          <h2 className="text-xl font-medium text-slate-600 mb-2">Analfabetismo Fiscal</h2>
          <div className="text-7xl font-black text-slate-900 tracking-tighter">
            {data.illiteracy}<span className="text-4xl text-slate-400">%</span>
          </div>
          <p className="mt-4 text-sm text-slate-500 leading-relaxed">
            De los alumnos se graduará sin los conocimientos administrativos mínimos para operar legalmente.
          </p>
        </div>

        {/* Card 2: Donut Chart - Incubator */}
        <div className="col-span-1 lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-slate-900">Uso de Preincubadora (AS009)</h2>
            <Info className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500 mb-6">Penetración actual del servicio institucional.</p>

          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value.toFixed(1)}%`}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-900">{data.preincubatorNonUsers}%</span>
              <span className="text-xs text-slate-500 font-medium">No Usuarios</span>
            </div>
          </div>
        </div>

        {/* Card 3: Horizontal Bar Chart - Fears */}
        <div className="col-span-1 lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Miedos y Preocupaciones (Día Cero)</h2>
            <p className="text-sm text-slate-500">Motivos de bloqueo o parálisis al finalizar la carrera (Múltiple elección).</p>
          </div>

          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.fears}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <XAxis
                  type="number"
                  hide={true} // Hide numbers to make it cleaner
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={220} // Give enough room for explicit text
                  tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', padding: '12px' }}
                />
                <Bar
                  dataKey="count"
                  fill="#0ea5e9" // light blue
                  radius={[0, 4, 4, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
