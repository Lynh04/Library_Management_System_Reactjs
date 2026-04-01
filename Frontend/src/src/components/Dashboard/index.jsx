import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, ArrowLeftRight, TrendingUp, History, Verified, ArrowRight, BookOpen as BookIcon, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [borrowings, setBorrowings] = useState([]);

  useEffect(() => {
    const savedAuthors = localStorage.getItem('library_authors');
    if (savedAuthors) setAuthors(JSON.parse(savedAuthors));

    const savedBooks = localStorage.getItem('library_books');
    if (savedBooks) setBooks(JSON.parse(savedBooks));

    const savedBorrowings = localStorage.getItem('library_borrowings');
    if (savedBorrowings) setBorrowings(JSON.parse(savedBorrowings));
  }, []);

  // Summary logic
  const totalAuthors = authors.length;
  const totalBooks = books.reduce((sum, book) => sum + book.totalStock, 0);
  const activeBooksPercentage = totalBooks > 0 ? Math.round((books.filter(b => b.availableStock > 0).length / books.length) * 100) : 0;
  const totalBorrowings = borrowings.length;
  
  // Borrow Status logic for PieChart
  const returnedCount = borrowings.filter(b => b.status === 'Returned').length;
  const borrowedCount = borrowings.filter(b => b.status === 'Borrowed').length;
  const data = [
    { name: 'Returned', value: returnedCount, color: '#2563eb' },
    { name: 'Borrowed', value: borrowedCount, color: '#f59e0b' },
  ];
  let returnedPercentage = 0;
  if (totalBorrowings > 0) {
    returnedPercentage = Math.round((returnedCount / totalBorrowings) * 100);
  }

  // Top Borrowed Books logic
  const bookBorrowCounts = {};
  borrowings.forEach(b => {
    bookBorrowCounts[b.bookId] = (bookBorrowCounts[b.bookId] || 0) + 1;
  });
  
  const getBookTitle = (id) => books.find(b => b._id === id)?.title || 'Unknown Volume';

  const topBooksData = Object.keys(bookBorrowCounts)
    .map(bookId => ({
      name: getBookTitle(bookId),
      borrows: bookBorrowCounts[bookId]
    }))
    .sort((a, b) => b.borrows - a.borrows)
    .slice(0, 5);

  // Recent Activity logic
  const recentActivities = [...borrowings]
    .sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate))
    .slice(0, 5)
    .map(b => {
      // Calculate a theoretical due date (14 days after borrowDate)
      const dateObj = new Date(b.borrowDate);
      dateObj.setDate(dateObj.getDate() + 14);
      const dueDateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      return {
        id: b.id,
        title: getBookTitle(b.bookId),
        member: b.borrowerName,
        dueDate: dueDateStr,
        status: b.status,
      }
    });

  return (
    <div className="p-8 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => navigate('/authors')}
          className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users size={24} />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded tracking-widest uppercase">Authors</span>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Total Authors</h3>
          <p className="text-3xl font-bold tracking-tight">{totalAuthors}</p>
          <div className="mt-4 flex items-center gap-1 text-[11px] text-blue-600">
            <TrendingUp size={14} />
            <span className="font-bold">Latest synced data</span>
          </div>
        </div>

        <div 
          onClick={() => navigate('/books')}
          className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-50 p-2 rounded-lg text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <BookIcon size={24} />
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded tracking-widest uppercase">Inventory</span>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Total Books</h3>
          <p className="text-3xl font-bold tracking-tight">{totalBooks}</p>
          <div className="mt-4 flex items-center gap-1 text-[11px] text-amber-600">
            <Verified size={14} />
            <span className="font-bold">{activeBooksPercentage}% active availability</span>
          </div>
        </div>

        <div 
          onClick={() => navigate('/borrowings')}
          className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ArrowLeftRight size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded tracking-widest uppercase">Borrowings</span>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Total Transactions</h3>
          <p className="text-3xl font-bold tracking-tight">{totalBorrowings}</p>
          <div className="mt-4 flex items-center gap-1 text-[11px] text-emerald-600">
            <History size={14} />
            <span className="font-bold">Average loan timeframe: 14 days</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Top Borrowed Books */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Top Borrowed Books</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Most circulated titles.</p>
            </div>
            <button 
              onClick={() => navigate('/statistics')}
              className="flex items-center gap-1 text-xs font-bold text-primary hover:underline underline-offset-4"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          
          <div className="h-[300px] w-full">
            {topBooksData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topBooksData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={false}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="borrows" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <BookOpen size={32} className="opacity-20 mb-2" />
                <p className="text-sm font-medium">No borrowing data available</p>
                <p className="text-xs opacity-60">Borrow books to see statistics here</p>
              </div>
            )}
          </div>
        </div>

        {/* Borrow Status */}
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-xl border border-border shadow-sm flex flex-col">
          <h2 className="text-lg font-bold tracking-tight mb-6">Borrow Status</h2>
          <div className="relative flex-1 flex items-center justify-center min-h-[200px]">
             {totalBorrowings > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
             ) : (
               <div className="w-full h-full rounded-full border-8 border-slate-100 flex items-center justify-center mt-6"></div>
             )}
             
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{returnedPercentage}%</span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Returned</span>
            </div>
          </div>
          
          <div className="space-y-3 mt-6">
            {data.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-medium">{item.name}</span>
                </div>
                <span className="text-xs font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <section className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Recent Activity</h2>
          <button 
            onClick={() => navigate('/borrowings')}
            className="text-xs font-bold text-primary hover:underline underline-offset-4"
          >View All Activity</button>
        </div>
        <div className="overflow-x-auto">
          {recentActivities.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Volume Title</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Member</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Due Date</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-muted/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-10 bg-muted rounded flex items-center justify-center text-muted-foreground">
                          <FileText size={16} />
                        </div>
                        <span className="text-sm font-bold">{activity.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{activity.member}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{activity.dueDate}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full",
                        activity.status === 'Borrowed' && "bg-blue-100 text-blue-700",
                        activity.status === 'Overdue' && "bg-red-100 text-red-700",
                        activity.status === 'Pending' && "bg-amber-100 text-amber-700",
                        activity.status === 'Returned' && "bg-emerald-100 text-emerald-700"
                      )}>
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
              <History size={40} className="mb-4 opacity-20" />
              <p className="font-medium">No recent activities found.</p>
              <p className="text-sm opacity-60">Transaction history will appear here once you start borrowing books.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}