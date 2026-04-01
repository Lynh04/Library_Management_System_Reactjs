import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ArrowLeftRight, 
  BarChart3,
  Library
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar({ currentPage, onPageChange }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'authors', label: 'Authors', icon: Users },
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'borrowings', label: 'Borrowings', icon: ArrowLeftRight },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-border flex flex-col z-50">
      <div className="p-6 flex items-center gap-2 border-b border-border">
        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
          <Library size={20} />
        </div>
        <span className="font-bold text-lg tracking-tight">LibAdmin</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              currentPage === item.id 
                ? "bg-secondary text-primary" 
                : "text-muted-foreground hover:bg-secondary hover:text-primary"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-xs font-medium text-muted-foreground mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold">Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}