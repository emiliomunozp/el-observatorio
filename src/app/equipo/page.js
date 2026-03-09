'use client';

import React, { useState } from 'react';
import { Search, Mail, UserCircle2, UserPlus, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTeam, deleteTeamMember } from '@/services/api';
import NewMemberModal from './NewMemberModal';

export default function DirectorioPage() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('Todos');
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

    const { data: teamMembers = [], isLoading } = useQuery({
        queryKey: ['team'],
        queryFn: fetchTeam,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTeamMember,
        onSuccess: () => queryClient.invalidateQueries(['team'])
    });

    const filteredData = teamMembers.filter(person => {
        const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'Todos' || person.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen pb-24 bg-slate-50 font-sans text-slate-900">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Directorio</h1>
                    <p className="text-slate-500 text-lg">Encuentra miembros de la Junta, Mentores UCM y Alumni.</p>
                </div>
                <button
                    onClick={() => setIsNewModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all"
                >
                    <UserPlus className="w-5 h-5" />
                    Nuevo Miembro
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                {/* Search Bar */}
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o departamento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg pl-12 pr-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-sm"
                    />
                </div>

                {/* Role Filter */}
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors min-w-[250px] shadow-sm appearance-none cursor-pointer"
                >
                    <option value="Todos">Todos los roles</option>
                    <option value="Junta Directiva">Junta Directiva</option>
                    <option value="Mentores (Profesores UCM)">Mentores (Profesores UCM)</option>
                    <option value="Alumni">Alumni</option>
                </select>
            </div>

            {/* Directory Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold tracking-wider">Nombre</th>
                                    <th className="px-6 py-4 font-semibold tracking-wider">Rol</th>
                                    <th className="px-6 py-4 font-semibold tracking-wider">Departamento / Especialidad</th>
                                    <th className="px-6 py-4 font-semibold tracking-wider">Contacto</th>
                                    <th className="px-6 py-4 font-semibold tracking-wider text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((person) => (
                                    <tr key={person.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                                    <UserCircle2 className="w-6 h-6 text-slate-400" />
                                                </div>
                                                <span className="font-semibold text-slate-900">{person.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border
                                                ${person.role === 'Junta Directiva' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                                                ${person.role === 'Mentores (Profesores UCM)' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                                                ${person.role === 'Alumni' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                            `}>
                                                {person.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-600">{person.department}</td>
                                        <td className="px-6 py-4">
                                            <a href={`mailto:${person.email}`} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium">
                                                <Mail className="w-4 h-4" />
                                                {person.email}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => deleteMutation.mutate(person.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-16 text-center text-slate-500 italic">
                                            No se encontraron miembros coincidentes en el directorio.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <NewMemberModal
                isOpen={isNewModalOpen}
                onClose={() => setIsNewModalOpen(false)}
            />
        </div>
    );
}
