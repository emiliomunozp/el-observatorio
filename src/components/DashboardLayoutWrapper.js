'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayoutWrapper({ children }) {
    const pathname = usePathname();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Home page uses pure layout, hides dashboard elements
    if (pathname === '/') {
        return <main className="flex-grow">{children}</main>;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-neutral-950">
            <Header toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

            <div className="flex-1 flex overflow-hidden">
                <Sidebar isCollapsed={isSidebarCollapsed} />

                {/* Main Content Area - Adjust margin based on sidebar state */}
                <main
                    className={`flex-1 overflow-y-auto overflow-x-hidden pt-16 transition-all duration-300 ease-in-out
            ${isSidebarCollapsed ? 'ml-16' : 'ml-[256px]'}
          `}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
