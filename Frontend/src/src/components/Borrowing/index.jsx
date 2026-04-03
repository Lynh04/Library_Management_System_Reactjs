import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { borrowingService } from '../../services/borrowingService';
import { bookService } from '../../services/bookService';
import { Plus, Search, Calendar, User, BookOpen, ArrowLeftRight, CheckCircle, Clock } from 'lucide-react';
import { Modal } from '../Modal';
import { Button, Badge } from '../ui';
import { cn } from '@/lib/utils';

const initialBooks = [
  { _id: '1', title: 'The Hour of the Star', authorId: '1', totalStock: 10, availableStock: 8, publishedYear: 1977, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { _id: '2', title: 'Ficciones', authorId: '2', totalStock: 5, availableStock: 2, publishedYear: 1944, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { _id: '3', title: 'The Old Man and the Sea', authorId: '3', totalStock: 12, availableStock: 0, publishedYear: 1952, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
];

const initialBorrowings = [
  { id: '1', bookId: '1', borrowerName: 'Julian Davenport', borrowDate: '2023-10-12', status: 'Borrowed' },
  { id: '2', bookId: '2', borrowerName: 'Elena Mikhailova', borrowDate: '2023-10-08', status: 'Returned' },
  { id: '3', bookId: '1', borrowerName: 'Samuel Roth', borrowDate: '2023-09-28', status: 'Borrowed' },
];

export default function Borrowings() {
  const navigate = useNavigate();
  const [borrowings, setBorrowings] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [borrowData, booksData] = await Promise.all([
        borrowingService.getAll(),
        bookService.getAll()
      ]);
      setBorrowings(borrowData);
      setBooks(booksData);
    } catch (err) {
      toast.error('Failed to load borrowing records');
    } finally {
      setIsLoading(false);
    }
  };

  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    bookId: '',
    borrowerName: ''
  });

  const handleBorrow = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        borrowDate: new Date().toISOString().split('T')[0]
      };
      await borrowingService.create(payload);
      await fetchData(); // Refresh to update stocks and titles
      setIsBorrowModalOpen(false);
      setFormData({ bookId: '', borrowerName: '' });
      toast.success('Loan confirmed successfully!');
    } catch (err) {
      toast.error('Failed to process loan');
    }
  };

  const handleReturn = async (borrowingId) => {
    try {
      await borrowingService.returnBook(borrowingId);
      await fetchData();
      toast.success('Volume returned to inventory!');
    } catch (err) {
      toast.error('Failed to process return');
    }
  };

  const getBookTitle = (bookData) => {
    if (typeof bookData === 'object' && bookData?.title) return bookData.title;
    return books.find(b => b._id === bookData)?.title || 'Unknown Volume';
  };

  const filteredBorrowings = borrowings.filter(b =>
    getBookTitle(b.bookId).toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.borrowerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Borrowings</h2>
          <p className="text-sm text-muted-foreground mt-1">Track institutional circulation and manage active loans.</p>
        </div>
        <Button onClick={() => setIsBorrowModalOpen(true)}>
          <ArrowLeftRight size={18} className="mr-2" />
          Borrow Book
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              className="w-full bg-white border border-border rounded-md pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Search by borrower or book..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Book Title</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Borrower</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBorrowings.map((record) => (
                <tr key={record._id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate('/books')}
                      className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer text-left"
                    >
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 transition-colors">
                        <BookOpen size={14} />
                      </div>
                      <span className="font-semibold text-sm">{getBookTitle(record.bookId)}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      {record.borrowerName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {record.borrowDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={record.status === 'Borrowed' ? 'secondary' : 'default'}>
                      {record.status === 'Borrowed' ? (
                        <Clock size={10} className="mr-1" />
                      ) : (
                        <CheckCircle size={10} className="mr-1" />
                      )}
                      {record.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {record.status === 'Borrowed' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs font-bold"
                        onClick={() => handleReturn(record._id)}
                      >
                        Return Book
                      </Button>
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground opacity-50">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Borrow Modal */}
      <Modal
        isOpen={isBorrowModalOpen}
        onClose={() => setIsBorrowModalOpen(false)}
        title="Initiate Borrowing"
      >
        <form className="space-y-4" onSubmit={handleBorrow}>
          <div className="space-y-2">
            <label className="text-sm font-bold tracking-tight">Select Volume</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <select
                required
                className="w-full bg-white border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                value={formData.bookId}
                onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
              >
                <option value="">Select a book...</option>
                {books.map(book => (
                  <option key={book._id} disabled={book.availableStock === 0} value={book._id}>
                    {book.title} ({book.availableStock} available)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold tracking-tight">Borrower Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                required
                className="w-full bg-white border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="e.g. Julian Davenport"
                type="text"
                value={formData.borrowerName}
                onChange={(e) => setFormData({ ...formData, borrowerName: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg border border-border">
            <div className="flex items-start gap-3">
              <Clock size={16} className="text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Policy Notice</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Standard institutional loan period is 14 days. Borrowers are responsible for the physical integrity of the volume.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsBorrowModalOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              disabled={!formData.bookId || books.find(b => b._id === formData.bookId)?.availableStock === 0}
            >
              Confirm Loan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}