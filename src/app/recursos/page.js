'use client';

import React, { useState } from 'react';
import { Search, FileText, Download, FileSpreadsheet, File } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchResources } from '@/services/api';

const getFileIcon = (type) => {
    if (type.includes('PDF')) return <FileText className="w-8 h-8 text-red-500" />;
    if (type.includes('Excel')) return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
    if (type.includes('Word')) return <FileText className="w-8 h-8 text-blue-500" />;
    return <File className="w-8 h-8 text-slate-500" />;
};

export default function RecursosPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: resources = [], isLoading } = useQuery({
        queryKey: ['resources'],
        queryFn: fetchResources,
    });

    const filteredResources = resources.filter(res =>
        res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen pb-24 bg-slate-50 font-sans text-slate-900">
            <div className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Centro de Recursos</h1>
                <p className="text-slate-500 text-lg">Documentación oficial, plantillas y guías de la Junior Empresa.</p>
            </div>

            <div className="relative mb-8 max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar plantillas, contratos, guías..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg pl-12 pr-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-sm"
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((resource) => (
                        <div key={resource.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col hover:shadow-md transition-shadow group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    {getFileIcon(resource.type)}
                                </div>
                                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                                    {resource.type}
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-slate-900 mb-2 leading-tight">{resource.title}</h3>
                            <p className="text-sm text-slate-600 mb-6 flex-grow leading-relaxed">
                                {resource.description}
                            </p>

                            <a
                                href={`/resources/${resource.filename}`}
                                download
                                className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg font-medium transition-colors border border-blue-100 hover:border-blue-600"
                            >
                                <Download className="w-4 h-4" />
                                Descargar Archivo
                            </a>
                        </div>
                    ))}

                    {filteredResources.length === 0 && (
                        <div className="col-span-full py-16 text-center text-slate-500 italic bg-white border border-slate-200 border-dashed rounded-2xl">
                            No se encontraron recursos que coincidan con tu búsqueda.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
