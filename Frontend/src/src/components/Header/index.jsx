import { useLocation } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';

export function TopBar() {
  const location = useLocation();
  
  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/authors': 'Authors',
    '/books': 'Books',
    '/borrowings': 'Borrowings',
    '/statistics': 'Statistics',
  };

  const title = pageTitles[location.pathname] || 'Library System';

  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-border flex items-center justify-between px-8 z-40">
      <h1 className="text-xl font-bold tracking-tight">{title}</h1>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            className="bg-muted/50 border border-border rounded-md pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all" 
            placeholder="Search catalog..." 
            type="text"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="text-muted-foreground hover:text-primary transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full border-2 border-white" />
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none">Admin User</p>
              <p className="text-xs text-muted-foreground mt-1">Super Admin</p>
            </div>
            <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center text-primary shadow-sm">
              <User size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}