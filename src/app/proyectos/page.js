'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchActiveProjects } from '@/services/dataPipeline';
import { AlertCircle, Clock, CheckCircle2, FlaskConical } from 'lucide-react';

const PHASE_CONFIG = {
    Ideation: { label: 'Ideación', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: FlaskConical },
    Prototyping: { label: 'Prototipado', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Clock },
    Testing: { label: 'Testing', color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: CheckCircle2 },
};

export default function ProyectosPage() {
    const { data: response, isLoading, isError } = useQuery({
        queryKey: ['activeProjects'],
        queryFn: fetchActiveProjects,
    });

    const projects = response?.data || [];
    const error = response?.error;

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen pb-24">
            <div className="mb-10">
                <h1 className="text-3xl font-light text-neutral-50 tracking-wide mb-2">Proyectos Activos</h1>
                <p className="text-neutral-400">Gestión y estado de encargos de la Junior Empresa.</p>
            </div>

            {(isLoading) && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neutral-500"></div>
                </div>
            )}

            {(isError || error) && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-start gap-4 mb-8">
                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-red-500 font-medium">Error cargando proyectos</h3>
                        <p className="text-neutral-400 text-sm mt-1">{error || "No se pudo conectar con el servidor de datos."}</p>
                    </div>
                </div>
            )}

            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {['Ideation', 'Prototyping', 'Testing'].map((phaseKey) => {
                        const phaseProjects = projects.filter(p => p.designPhase === phaseKey);
                        const { label, color, icon: Icon } = PHASE_CONFIG[phaseKey];

                        return (
                            <div key={phaseKey} className="flex flex-col gap-4">
                                {/* Column Header */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`w-3 h-3 rounded-full ${color.split(' ')[0]}`}></span>
                                    <h2 className="uppercase tracking-widest text-xs font-bold text-neutral-300">
                                        {label} <span className="text-neutral-600 ml-1">({phaseProjects.length})</span>
                                    </h2>
                                </div>

                                {/* Cards Container */}
                                <div className="flex flex-col gap-4">
                                    {phaseProjects.map(project => (
                                        <div
                                            key={project.id}
                                            className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/10 transition-colors shadow-lg"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-lg font-medium text-neutral-100">{project.projectName}</h3>
                                                <Icon className={`w-5 h-5 flex-shrink-0 opacity-80 ${color.split(' ')[1]}`} />
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Cliente</p>
                                                    <p className="text-sm text-neutral-300 font-medium">{project.client}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Equipo Asignado</p>
                                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
                                                        {project.assignedTeam}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {phaseProjects.length === 0 && (
                                        <div className="bg-neutral-900/50 border border-neutral-800/50 border-dashed rounded-xl p-6 flex items-center justify-center text-neutral-600 text-sm h-32">
                                            Sin proyectos activos
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
