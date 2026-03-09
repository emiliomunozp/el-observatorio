'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProjects, updateProjectPhase, deleteProject } from '@/services/api';
import { AlertCircle, Clock, CheckCircle2, FlaskConical, Trash2, ArrowRight, ArrowLeft, Plus } from 'lucide-react';
import NewProjectModal from './NewProjectModal';

const PHASE_CONFIG = {
    Ideation: { label: 'Ideación', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: FlaskConical, next: 'Prototyping', prev: null },
    Prototyping: { label: 'Prototipado', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Clock, next: 'Testing', prev: 'Ideation' },
    Testing: { label: 'Testing', color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: CheckCircle2, next: null, prev: 'Prototyping' },
};

export default function ProyectosPage() {
    const queryClient = useQueryClient();
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

    const { data: projects = [], isLoading, isError, error } = useQuery({
        queryKey: ['projects'],
        queryFn: fetchProjects,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, phase }) => updateProjectPhase(id, phase),
        onSuccess: () => queryClient.invalidateQueries(['projects'])
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProject,
        onSuccess: () => queryClient.invalidateQueries(['projects'])
    });

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen pb-24 bg-slate-50 font-sans text-slate-900">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Proyectos Activos</h1>
                    <p className="text-slate-500 text-lg">Tablero Kanban de gestión de encargos.</p>
                </div>
                <button
                    onClick={() => setIsNewModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Proyecto
                </button>
            </div>

            {(isLoading) && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            )}

            {(isError) && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4 mb-8">
                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-red-700 font-medium">Error cargando proyectos</h3>
                        <p className="text-red-600/80 text-sm mt-1">{error?.message || "No se pudo conectar con el servidor."}</p>
                    </div>
                </div>
            )}

            {!isLoading && !isError && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                    {['Ideation', 'Prototyping', 'Testing'].map((phaseKey) => {
                        const phaseProjects = projects.filter(p => p.designPhase === phaseKey);
                        const config = PHASE_CONFIG[phaseKey];
                        const Icon = config.icon;

                        return (
                            <div key={phaseKey} className="flex flex-col gap-4 bg-slate-100/50 rounded-2xl p-4 border border-slate-200">
                                {/* Column Header */}
                                <div className="flex items-center gap-2 mb-2 px-2">
                                    <span className={`w-3 h-3 rounded-full ${config.color.split(' ')[0]}`}></span>
                                    <h2 className="uppercase tracking-widest text-xs font-bold text-slate-600">
                                        {config.label} <span className="text-slate-400 ml-1">({phaseProjects.length})</span>
                                    </h2>
                                </div>

                                {/* Cards Container */}
                                <div className="flex flex-col gap-3">
                                    {phaseProjects.map(project => (
                                        <div
                                            key={project.id}
                                            className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow group flex flex-col h-full"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-lg font-semibold text-slate-900 leading-tight pr-4">{project.projectName}</h3>
                                                <Icon className={`w-5 h-5 flex-shrink-0 ${config.color.split(' ')[1]}`} />
                                            </div>

                                            <div className="space-y-3 mb-6 flex-grow">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Cliente</p>
                                                    <p className="text-sm text-slate-700 font-medium">{project.client}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Equipo Asignado</p>
                                                    <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                                        {project.assignedTeam}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                                                <button
                                                    onClick={() => deleteMutation.mutate(project.id)}
                                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                    title="Eliminar proyecto"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>

                                                <div className="flex gap-1 border border-slate-100 rounded-lg p-0.5 bg-slate-50">
                                                    <button
                                                        disabled={!config.prev || updateMutation.isPending}
                                                        onClick={() => updateMutation.mutate({ id: project.id, phase: config.prev })}
                                                        className="p-1.5 text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent rounded transition-all"
                                                        title="Retroceder fase"
                                                    >
                                                        <ArrowLeft className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        disabled={!config.next || updateMutation.isPending}
                                                        onClick={() => updateMutation.mutate({ id: project.id, phase: config.next })}
                                                        className="p-1.5 text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent rounded transition-all"
                                                        title="Avanzar fase"
                                                    >
                                                        <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {phaseProjects.length === 0 && (
                                        <div className="bg-transparent border-2 border-slate-200 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 h-32 text-sm italic">
                                            Vacio
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <NewProjectModal
                isOpen={isNewModalOpen}
                onClose={() => setIsNewModalOpen(false)}
            />
        </div>
    );
}
