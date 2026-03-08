'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    LayoutDashboard,
    FolderKanban,
    Users,
    Calculator,
    FileText
} from 'lucide-react';

const MENU_ITEMS = [
    { name: 'Portada', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Proyectos', href: '/proyectos', icon: FolderKanban },
    { name: 'Equipo', href: '/equipo', icon: Users },
    { name: 'Herramientas', href: '/simulador', icon: Calculator },
    { name: 'Recursos', href: '/recursos', icon: FileText },
];

export default function Sidebar({ isCollapsed, toggleSidebar }) {
    const pathname = usePathname();

    return (
        <aside
            className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out bg-white border-r border-slate-200 flex flex-col pt-16
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
        >
            <div className="flex flex-col h-full overflow-y-auto px-3 py-4">
                <ul className="space-y-2 font-medium">
                    {MENU_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center p-2 rounded-lg group transition-colors duration-200
                    ${isActive
                                            ? 'bg-slate-100 text-blue-600'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }
                  `}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {!isCollapsed && (
                                        <span className="ml-3 whitespace-nowrap">{item.name}</span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
}
