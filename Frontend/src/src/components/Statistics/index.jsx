import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import { borrowingService } from '../../services/borrowingService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, ArrowLeftRight, BookOpen, Users, Download, Filter, Calendar } from 'lucide-react';
import { Button } from '../ui';

export default function Statistics() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [borrowings, setBorrowings] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      const [booksData, borrowData] = await Promise.all([
        bookService.getAll(),
        borrowingService.getAll()
      ]);
      setBooks(booksData);
      setBorrowings(borrowData);
    } catch (err) {
      console.error('Failed to load statistics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalEvents = borrowings.length;

  // Borrow Status Pie Chart
  const returnedCount = borrowings.filter(b => b.status === 'Returned').length;
  const borrowedCount = borrowings.filter(b => b.status === 'Borrowed').length;

  const borrowStatusData = [
    { name: 'Returned', value: returnedCount, color: '#2563eb' },
    { name: 'Borrowed', value: borrowedCount, color: '#f59e0b' },
  ];

  const returnEfficiency = totalEvents > 0 ? ((returnedCount / totalEvents) * 100).toFixed(1) : 0;

  // Top Borrowed Books logic
  const bookBorrowCounts = {};
  borrowings.forEach(b => {
    bookBorrowCounts[b.bookId] = (bookBorrowCounts[b.bookId] || 0) + 1;
  });

  const getBookTitle = (bookData) => {
    if (typeof bookData === 'object' && bookData?.title) return bookData.title;
    return books.find(b => b._id === bookData)?.title || 'Unknown Volume';
  };

  const topBooksData = Object.keys(bookBorrowCounts)
    .map(bookId => ({
      name: getBookTitle(bookId),
      borrows: bookBorrowCounts[bookId]
    }))
    .sort((a, b) => b.borrows - a.borrows)
    .slice(0, 7);

  // Monthly trends logic (last 6 months)
  const currentMonth = new Date().getMonth();
  const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    let m = currentMonth - i;
    if (m < 0) m += 12;
    last6Months.push(monthsList[m]);
  }

  const trendsMap = {};
  last6Months.forEach(m => trendsMap[m] = 0);

  borrowings.forEach(b => {
    const m = new Date(b.borrowDate).getMonth();
    const mName = monthsList[m];
    // Only count if it's within the last 6 months bucket we generated
    if (trendsMap[mName] !== undefined) {
      trendsMap[mName] += 1;
    }
  });

  const monthlyTrends = last6Months.map(m => ({ month: m, borrows: trendsMap[m] }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Institutional Statistics</h2>
          <p className="text-sm text-muted-foreground mt-1">Data-driven insights into collection circulation and engagement.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar size={16} className="mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm">
            <Filter size={16} className="mr-2" />
            Filter Wing
          </Button>
          <Button size="sm">
            <Download size={16} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Top Borrowed Books Bar Chart */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Top Borrowed Volumes</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Most circulated titles across all departments.</p>
            </div>
          </div>

          <div className="h-[400px] w-full">
            {topBooksData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topBooksData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                    width={120}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="borrows" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No borrowing data available for Top Volumes.
              </div>
            )}
          </div>
        </div>

        {/* Borrow Status Pie Chart */}
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-xl border border-border shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-amber-50 p-2 rounded-lg text-amber-600">
              <ArrowLeftRight size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Circulation Status</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Borrowed vs Returned ratio.</p>
            </div>
          </div>

          <div className="relative flex-1 flex items-center justify-center min-h-[300px]">
            {totalEvents > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={borrowStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {borrowStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-medium text-muted-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full rounded-full border-8 border-slate-100 flex items-center justify-center"></div>
            )}

            <div
              onClick={() => navigate('/borrowings')}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto cursor-pointer group pb-8"
            >
              <span className="text-3xl font-black text-primary group-hover:scale-110 transition-transform">{totalEvents}</span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest group-hover:text-primary transition-colors">Total Events</span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-muted/30 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Return Efficiency</span>
              <span className="text-xs font-black text-primary">{returnEfficiency}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${returnEfficiency}%` }}></div>
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="col-span-12 bg-white p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Monthly Borrowing Trends</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Volume of circulation events over the last 6 months.</p>
            </div>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="borrows" fill="#10b981" radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}