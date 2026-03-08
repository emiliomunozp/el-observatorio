'use client';

import React from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import useStore from '../store/useStore';

export default function Header({ toggleSidebar }) {
    const userProfile = useStore(state => state.userProfile);

    return (
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
                    <div className="hidden md:flex relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>

                    <button className="text-slate-400 hover:text-slate-700 transition-colors">
                        <Bell className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 hidden sm:block">
                            {userProfile || 'Invitado'}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
