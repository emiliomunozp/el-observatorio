'use client';

import React from 'react';
import { FileText, Download, FileSpreadsheet, FileBadge } from 'lucide-react';

const RESOURCES = [
    {
        id: 1,
        title: "Plantilla de Presupuesto",
        description: "Formato oficial para presentar propuestas económicas a clientes respetando la estructura de Junior Empresa.",
        icon: FileSpreadsheet,
        type: "Excel (.xlsx)"
    },
    {
        id: 2,
        title: "Guía de Facturación UCM",
        description: "Instrucciones paso a paso para procesar pagos a través de la infraestructura fiscal de la universidad.",
        icon: FileText,
        type: "PDF (.pdf)"
    },
    {
        id: 3,
        title: "Estatutos Junior Empresa",
        description: "Documento fundacional y normativa interna de la asociación El Observatorio J.E.",
        icon: FileBadge,
        type: "PDF (.pdf)"
    },
    {
        id: 4,
        title: "Contrato de Prestación de Servicios",
        description: "Modelo de contrato legal estándar para proyectos con partes externas y entidades privadas.",
        icon: FileText,
        type: "Word (.docx)"
    }
];

export default function RecursosPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen pb-24">
            <div className="mb-10">
                <h1 className="text-3xl font-light text-neutral-50 tracking-wide mb-2">Recursos</h1>
                <p className="text-neutral-400">Documentación, plantillas y guías oficiales de la Junior Empresa.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {RESOURCES.map((resource) => {
                    const Icon = resource.icon;

                    return (
                        <div
                            key={resource.id}
                            className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-colors flex flex-col h-full group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center mb-6 text-neutral-400 group-hover:text-white group-hover:bg-neutral-700 transition-all">
                                <Icon className="w-6 h-6" />
                            </div>

                            <h3 className="text-lg font-medium text-neutral-100 mb-2">{resource.title}</h3>
                            <p className="text-sm text-neutral-400 mb-6 flex-grow leading-relaxed">
                                {resource.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-neutral-800 mt-auto">
                                <span className="text-xs font-medium text-neutral-500 tracking-wider uppercase">
                                    {resource.type}
                                </span>
                                <button className="flex items-center gap-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors">
                                    <Download className="w-4 h-4" />
                                    Descargar
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
