'use client';

import React from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import useStore from '../store/useStore';

export default function Header({ toggleSidebar }) {
    const userProfile = useStore(state => state.userProfile);

    return (
        <header className="fixed top-0 z-50 w-full bg-neutral-900 border-b border-neutral-800">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-1 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-neutral-50 transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <span className="text-xl tracking-wider font-light text-neutral-50 uppercase">
                        El Observatorio <span className="text-neutral-500 text-sm ml-2">Junior Empresa</span>
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="pl-9 pr-4 py-1.5 bg-neutral-950 border border-neutral-800 rounded-sm text-sm text-neutral-50 focus:outline-none focus:border-neutral-500 transition-colors"
                        />
                    </div>

                    <button className="text-neutral-400 hover:text-neutral-50 transition-colors">
                        <Bell className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2 pl-4 border-l border-neutral-800">
                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">
                            <User className="w-4 h-4 text-neutral-400" />
                        </div>
                        <span className="text-sm font-medium text-neutral-300 hidden sm:block">
                            {userProfile || 'Invitado'}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
