import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ArrowLeftRight, 
  BarChart3,
  Library
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar({ isOpen, setIsOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'authors', label: 'Authors', icon: Users, path: '/authors' },
    { id: 'books', label: 'Books', icon: BookOpen, path: '/books' },
    { id: 'borrowings', label: 'Borrowings', icon: ArrowLeftRight, path: '/borrowings' },
    { id: 'statistics', label: 'Statistics', icon: BarChart3, path: '/statistics' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-white border-r border-border flex flex-col z-50 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 flex items-center gap-2 border-b border-border">
        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
          <Library size={20} />
        </div>
        <span className="font-bold text-lg tracking-tight">LibAdmin</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:ring-1 hover:ring-primary/10",
              isActive 
                ? "bg-secondary text-primary shadow-sm" 
                : "text-muted-foreground hover:bg-secondary/50 hover:text-primary"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-xs font-bold text-emerald-600">Core Online</span>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}