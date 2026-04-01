import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, BookOpen, User, Calendar, Hash, AlertTriangle } from 'lucide-react';
import { Modal } from '../Modal';
import { Button, Badge } from '../UI';
import { cn } from '@/lib/utils';

const initialAuthors = [
  { _id: '1', name: 'Clarice Lispector', bio: 'Renowned for her innovative stream-of-consciousness style...', birthDate: '1920-12-10', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { _id: '2', name: 'Jorge Luis Borges', bio: 'A central figure in Spanish-language literature...', birthDate: '1899-08-24', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { _id: '3', name: 'Ernest Hemingway', bio: 'Master of the iceberg theory...', birthDate: '1899-07-21', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { _id: '4', name: 'Gabriel García Márquez', bio: 'Pioneer of magical realism...', birthDate: '1927-03-06', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { _id: '5', name: 'Virginia Woolf', bio: 'Key figure of modernist literature...', birthDate: '1882-01-25', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
];

const initialBooks = [
  { _id: '1', title: 'The Hour of the Star', authorId: '1', totalStock: 10, availableStock: 8, publishedYear: 1977, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { _id: '2', title: 'Ficciones', authorId: '2', totalStock: 5, availableStock: 2, publishedYear: 1944, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { _id: '3', title: 'The Old Man and the Sea', authorId: '3', totalStock: 12, availableStock: 0, publishedYear: 1952, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { _id: '4', title: 'Near to the Wild Heart', authorId: '1', totalStock: 8, availableStock: 1, publishedYear: 1943, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { _id: '5', title: 'The Aleph', authorId: '2', totalStock: 15, availableStock: 15, publishedYear: 1949, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
];

export default function Books() {
  const navigate = useNavigate();
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('library_books');
    return saved ? JSON.parse(saved) : initialBooks;
  });
  
  const [authors] = useState(() => {
    const saved = localStorage.getItem('library_authors');
    return saved ? JSON.parse(saved) : initialAuthors;
  });

  useEffect(() => {
    localStorage.setItem('library_books', JSON.stringify(books));
  }, [books]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    authorId: '',
    totalStock: 0,
    publishedYear: new Date().getFullYear()
  });

  const handleAddBook = (e) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const newBook = {
      _id: Math.random().toString(36).substr(2, 9),
      ...formData,
      availableStock: formData.totalStock,
      createdAt: now,
      updatedAt: now
    };
    setBooks([...books, newBook]);
    setIsAddModalOpen(false);
    setFormData({ title: '', authorId: '', totalStock: 0, publishedYear: new Date().getFullYear() });
  };

  const handleViewClick = (book) => {
    setSelectedBook(book);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      authorId: book.authorId,
      totalStock: book.totalStock,
      publishedYear: book.publishedYear || new Date().getFullYear()
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateBook = (e) => {
    e.preventDefault();
    if (selectedBook) {
      const now = new Date().toISOString();
      // Adjust available stock based on the change in total stock
      const stockDiff = formData.totalStock - selectedBook.totalStock;
      setBooks(books.map(b => b._id === selectedBook._id ? { 
        ...b, 
        ...formData, 
        availableStock: Math.max(0, b.availableStock + stockDiff),
        updatedAt: now
      } : b));
      setIsEditModalOpen(false);
      setSelectedBook(null);
      setFormData({ title: '', authorId: '', totalStock: 0, publishedYear: new Date().getFullYear() });
    }
  };

  const getAuthorName = (id) => authors.find(a => a._id === id)?.name || 'Unknown';

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Books</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your library's physical collection and inventory.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Add Book
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              className="w-full bg-white border border-border rounded-md pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
              placeholder="Search catalog..." 
              type="text"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Title</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Author</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Year</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Stock</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-10 bg-muted rounded flex items-center justify-center text-muted-foreground">
                        <BookOpen size={16} />
                      </div>
                      <span className="font-semibold text-sm">{book.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                    <button 
                      onClick={() => navigate('/authors')}
                      className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
                    >
                      <User size={14} />
                      {getAuthorName(book.authorId)}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {book.publishedYear}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Available</span>
                        <span className={cn(
                          "text-sm font-bold",
                          book.availableStock === 0 ? "text-destructive" : book.availableStock < 3 ? "text-amber-600" : "text-emerald-600"
                        )}>
                          {book.availableStock} / {book.totalStock}
                        </span>
                      </div>
                      {book.availableStock < 3 && (
                        <Badge variant={book.availableStock === 0 ? "destructive" : "secondary"} className="h-5">
                          <AlertTriangle size={10} className="mr-1" />
                          {book.availableStock === 0 ? "Out of Stock" : "Low Stock"}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" onClick={() => handleViewClick(book)}>
                        <Eye size={16} />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleEditClick(book)}>
                        <Edit2 size={16} />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setSelectedBook(book);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Book Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New Volume"
      >
        <form className="space-y-4" onSubmit={handleAddBook}>
          <div className="space-y-2">
            <label className="text-sm font-bold tracking-tight">Book Title</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                required
                className="w-full bg-white border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                placeholder="e.g. One Hundred Years of Solitude"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold tracking-tight">Author</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <select 
                required
                className="w-full bg-white border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                value={formData.authorId}
                onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
              >
                <option value="">Select an author...</option>
                {authors.map(author => (
                  <option key={author._id} value={author._id}>{author.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold tracking-tight">Total Stock</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input 
                  required
                  className="w-full bg-white border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                  min="1"
                  type="number"
                  value={formData.totalStock}
                  onChange={(e) => setFormData({ ...formData, totalStock: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold tracking-tight">Published Year (Optional)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input 
                  className="w-full bg-white border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                  max={new Date().getFullYear()}
                  type="number"
                  value={formData.publishedYear}
                  onChange={(e) => setFormData({ ...formData, publishedYear: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Catalog Volume</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Book Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Volume"
      >
        <form className="space-y-4" onSubmit={handleUpdateBook}>
          <div className="space-y-2">
            <label className="text-sm font-bold tracking-tight">Book Title</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                required
                className="w-full bg-white border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                placeholder="e.g. One Hundred Years of Solitude"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold tracking-tight">Author</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <select 
                required
                className="w-full bg-white border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                value={formData.authorId}
                onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
              >
                <option value="">Select an author...</option>
                {authors.map(author => (
                  <option key={author._id} value={author._id}>{author.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold tracking-tight">Total Stock</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input 
                  required
                  className="w-full bg-white border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                  min="1"
                  type="number"
                  value={formData.totalStock}
                  onChange={(e) => setFormData({ ...formData, totalStock: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold tracking-tight">Published Year (Optional)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input 
                  className="w-full bg-white border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                  max={new Date().getFullYear()}
                  type="number"
                  value={formData.publishedYear}
                  onChange={(e) => setFormData({ ...formData, publishedYear: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="submit">Update Volume</Button>
          </div>
        </form>
      </Modal>

      {/* View Book Modal */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        title="Volume Details"
      >
        {selectedBook && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg border border-border">
              <div className="w-12 h-16 bg-muted rounded flex items-center justify-center text-muted-foreground shadow-inner">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedBook.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <User size={14} />
                  {getAuthorName(selectedBook.authorId)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Inventory</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Stock:</span>
                    <span className="font-semibold">{selectedBook.totalStock}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available:</span>
                    <span className={cn(
                      "font-bold",
                      selectedBook.availableStock === 0 ? "text-destructive" : "text-emerald-600"
                    )}>{selectedBook.availableStock}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Publication</h4>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-muted-foreground" />
                  <span className="font-medium">{selectedBook.publishedYear || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Created At</span>
                <p className="text-xs font-medium">{new Date(selectedBook.createdAt).toLocaleString()}</p>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Last Updated</span>
                <p className="text-xs font-medium">{new Date(selectedBook.updatedAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setIsViewModalOpen(false)}>Close Details</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Confirm Deletion"
        className="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-bold text-foreground">{selectedBook?.title}</span>? This will remove the volume from the institutional catalog permanently.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Keep Volume</Button>
            <Button variant="destructive" onClick={() => {
              setBooks(books.filter(b => b._id !== selectedBook?._id));
              setIsDeleteModalOpen(false);
            }}>Remove Volume</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}