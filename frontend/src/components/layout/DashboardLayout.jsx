import React, { useState } from 'react';
import { Sidebar } from '../common/Sidebar';
import { Navbar } from '../common/Navbar';
import { cn } from '../../lib/utils';

export default function DashboardLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const openMobileSidebar = () => setIsMobileSidebarOpen(true);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-[var(--color-brand-background)] font-sans text-[var(--color-brand-text)]">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={toggleSidebar}
        isMobileOpen={isMobileSidebarOpen}
        closeMobile={closeMobileSidebar}
      />
      
      <div 
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "md:ml-16" : "md:ml-60"
        )}
      >
        <Navbar openMobileSidebar={openMobileSidebar} />
        
        <main className="flex-1 w-full max-w-[1280px] mx-auto p-4 sm:p-6 lg:p-8 page-enter-active">
          {children}
        </main>
      </div>
    </div>
  );
}
