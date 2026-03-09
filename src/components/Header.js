'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, User, X, Briefcase, UserCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchProfile, fetchTeam, fetchProjects } from '@/services/api';
import useStore from '../store/useStore';
import ProfileModal from './ProfileModal';
import Link from 'next/link';

export default function Header({ toggleSidebar }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchRef = useRef(null);

    // Fetch data globally
    const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: fetchProfile });
    const { data: team = [] } = useQuery({ queryKey: ['team'], queryFn: fetchTeam });
    const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });

    // Handle outside click to close search
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchRef]);

    const filteredTeam = searchTerm.length > 1 ? team.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.department.toLowerCase().includes(searchTerm.toLowerCase())) : [];
    const filteredProjects = searchTerm.length > 1 ? projects.filter(p => p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || p.client.toLowerCase().includes(searchTerm.toLowerCase())) : [];
    const hasResults = filteredTeam.length > 0 || filteredProjects.length > 0;

    return (
        <>
            <header className="fixed top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <span className="text-xl tracking-wider font-semibold text-slate-900 uppercase">
                            El Observatorio <span className="text-slate-500 font-normal text-sm ml-2">Junior Empresa</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Container */}
                        <div className="hidden md:block relative" ref={searchRef}>
                            <div className="relative z-10">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar proyectos o equipo..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    className="w-[300px] pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => { setSearchTerm(''); setIsSearchFocused(false); }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* Search Dropdown overlay */}
                            {isSearchFocused && searchTerm.length > 1 && (
                                <div className="absolute top-10 left-0 w-[400px] right-0 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-20 max-h-[400px] overflow-y-auto">
                                    <div className="p-2">
                                        {!hasResults ? (
                                            <div className="p-4 text-center text-sm text-slate-500 italic">No se encontraron resultados para &quot;{searchTerm}&quot;</div>
                                        ) : (
                                            <>
                                                {filteredProjects.length > 0 && (
                                                    <div className="mb-2">
                                                        <h3 className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 rounded-md">Proyectos</h3>
                                                        {filteredProjects.map(p => (
                                                            <Link href="/proyectos" key={p.id} onClick={() => setIsSearchFocused(false)}>
                                                                <div className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer rounded-lg transition-colors group">
                                                                    <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-200">
                                                                        <Briefcase className="w-4 h-4" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-sm font-semibold text-slate-900 leading-tight">{p.projectName}</div>
                                                                        <div className="text-xs text-slate-500">{p.client} • Fase: {p.designPhase}</div>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}

                                                {filteredTeam.length > 0 && (
                                                    <div>
                                                        <h3 className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 rounded-md">Equipo</h3>
                                                        {filteredTeam.map(m => (
                                                            <Link href="/equipo" key={m.id} onClick={() => setIsSearchFocused(false)}>
                                                                <div className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer rounded-lg transition-colors group">
                                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 group-hover:bg-white">
                                                                        <UserCircle2 className="w-5 h-5" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-sm font-semibold text-slate-900 leading-tight">{m.name}</div>
                                                                        <div className="text-xs text-slate-500">{m.role} • {m.department}</div>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button className="text-slate-400 hover:text-slate-700 transition-colors">
                            <Bell className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => setIsProfileOpen(true)}
                            className="flex items-center gap-2 pl-4 border-l border-slate-200 hover:bg-slate-50 transition-colors p-1 rounded group"
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:border-slate-300">
                                <User className="w-4 h-4 text-slate-500" />
                            </div>
                            <div className="hidden sm:block text-left">
                                <span className="block text-sm font-medium text-slate-700 leading-tight">
                                    {profile?.name || 'Cargando...'}
                                </span>
                                <span className="block text-xs text-slate-400 font-medium line-clamp-1 max-w-[120px]">
                                    {profile?.role || 'Guest'}
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                profile={profile}
            />
        </>
    );
}
