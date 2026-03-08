'use client';

import React, { useState } from 'react';
import { Search, Mail, UserCircle2 } from 'lucide-react';

const DIRECTORY_DATA = [
    { id: 1, name: "Dra. Alicia Alfonso", role: "Junta Directiva", department: "Dirección MUDi", email: "aalfonso@ucm.es" },
    { id: 2, name: "Emilio Muñoz", role: "Junta Directiva", department: "Coordinación Estratégica", email: "emunoz@ucm.es" },
    { id: 3, name: "Prof. Carlos Ruiz", role: "Mentores (Profesores UCM)", department: "Fiscalidad y Empresa", email: "cruiz@ucm.es" },
    { id: 4, name: "Elena García", role: "Alumni", department: "Diseño de Producto", email: "elena.g@alumni.ucm.es" },
    { id: 5, name: "Marcos Torres", role: "Alumni", department: "Desarrollo Web", email: "marcos.t@alumni.ucm.es" },
];

export default function DirectorioPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('Todos');

    const filteredData = DIRECTORY_DATA.filter(person => {
        const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'Todos' || person.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen pb-24">
            <div className="mb-10">
                <h1 className="text-3xl font-light text-neutral-50 tracking-wide mb-2">Directorio</h1>
                <p className="text-neutral-400">Encuentra miembros de la Junta, Mentores UCM y Alumni.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                {/* Search Bar */}
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o departamento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-12 pr-4 py-3 text-neutral-100 focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                </div>

                {/* Role Filter */}
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-100 focus:outline-none focus:border-neutral-500 transition-colors min-w-[200px]"
                >
                    <option value="Todos">Todos los roles</option>
                    <option value="Junta Directiva">Junta Directiva</option>
                    <option value="Mentores (Profesores UCM)">Mentores (Profesores UCM)</option>
                    <option value="Alumni">Alumni</option>
                </select>
            </div>

            {/* Directory Table */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-neutral-400">
                        <thead className="text-xs text-neutral-500 uppercase bg-neutral-900 border-b border-neutral-800">
                            <tr>
                                <th className="px-6 py-4 font-medium">Nombre</th>
                                <th className="px-6 py-4 font-medium">Rol</th>
                                <th className="px-6 py-4 font-medium">Departamento / Especialidad</th>
                                <th className="px-6 py-4 font-medium">Contacto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((person) => (
                                <tr key={person.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">
                                                <UserCircle2 className="w-5 h-5 text-neutral-500" />
                                            </div>
                                            <span className="font-medium text-neutral-200">{person.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                      ${person.role === 'Junta Directiva' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : ''}
                      ${person.role === 'Mentores (Profesores UCM)' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                      ${person.role === 'Alumni' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                    `}>
                                            {person.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{person.department}</td>
                                    <td className="px-6 py-4">
                                        <a href={`mailto:${person.email}`} className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors">
                                            <Mail className="w-4 h-4" />
                                            {person.email}
                                        </a>
                                    </td>
                                </tr>
                            ))}

                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-neutral-500">
                                        No se encontraron resultados para tu búsqueda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
