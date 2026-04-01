import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Calendar, User } from 'lucide-react';
import { Modal } from '../Modal';
import { Button, Badge } from '../UI';

const initialAuthors = [
    { _id: '1', name: 'Clarice Lispector', bio: 'Renowned for her innovative stream-of-consciousness style...', birthDate: '1920-12-10', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
    { _id: '2', name: 'Jorge Luis Borges', bio: 'A central figure in Spanish-language literature...', birthDate: '1899-08-24', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
    { _id: '3', name: 'Ernest Hemingway', bio: 'Master of the iceberg theory...', birthDate: '1899-07-21', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
    { _id: '4', name: 'Gabriel García Márquez', bio: 'Pioneer of magical realism...', birthDate: '1927-03-06', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
    { _id: '5', name: 'Virginia Woolf', bio: 'Key figure of modernist literature...', birthDate: '1882-01-25', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
];

export default function Authors() {
    const [authors, setAuthors] = useState(() => {
        const saved = localStorage.getItem('library_authors');
        return saved ? JSON.parse(saved) : initialAuthors;
    });

    useEffect(() => {
        localStorage.setItem('library_authors', JSON.stringify(authors));
    }, [authors]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        birthDate: ''
    });

    const handleAddAuthor = (e) => {
        e.preventDefault();
        const now = new Date().toISOString();
        const newAuthor = {
            _id: Math.random().toString(36).substr(2, 9),
            ...formData,
            createdAt: now,
            updatedAt: now
        };
        setAuthors([...authors, newAuthor]);
        setIsAddModalOpen(false);
        setFormData({ name: '', bio: '', birthDate: '' });
    };

    const handleViewClick = (author) => {
        setSelectedAuthor(author);
        setIsViewModalOpen(true);
    };

    const handleEditClick = (author) => {
        setSelectedAuthor(author);
        setFormData({
            name: author.name,
            bio: author.bio,
            birthDate: author.birthDate
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateAuthor = (e) => {
        e.preventDefault();
        if (selectedAuthor) {
            const now = new Date().toISOString();
            setAuthors(authors.map(a => a._id === selectedAuthor._id ? { ...a, ...formData, updatedAt: now } : a));
            setIsEditModalOpen(false);
            setSelectedAuthor(null);
            setFormData({ name: '', bio: '', birthDate: '' });
        }
    };

    const handleDelete = () => {
        if (selectedAuthor) {
            setAuthors(authors.filter(a => a._id !== selectedAuthor._id));
            setIsDeleteModalOpen(false);
            setSelectedAuthor(null);
        }
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Authors</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage the literary contributors in your collection.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus size={18} className="mr-2" />
                    Add Author
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                            className="w-full bg-white border border-border rounded-md pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="Search authors..."
                            type="text"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Birth Date</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Bio Preview</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {authors.map((author) => (
                                <tr key={author._id} className="hover:bg-muted/10 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-xs">
                                                {author.name.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-sm">{author.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {author.birthDate}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <p className="text-sm text-muted-foreground truncate">{author.bio}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="icon" variant="ghost" onClick={() => handleViewClick(author)}>
                                                <Eye size={16} />
                                            </Button>
                                            <Button size="icon" variant="ghost" onClick={() => handleEditClick(author)}>
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => {
                                                    setSelectedAuthor(author);
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

            {/* Add Author Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Author"
            >
                <form className="space-y-4" onSubmit={handleAddAuthor}>
                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-tight">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input
                                required
                                className="w-full bg-white border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="e.g. Gabriel García Márquez"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-tight">Birth Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input
                                required
                                className="w-full bg-white border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                type="date"
                                value={formData.birthDate}
                                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-tight">Biography</label>
                        <textarea
                            required
                            className="w-full bg-white border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[120px]"
                            placeholder="Brief overview of the author's life and works..."
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Register Author</Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Author Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Author"
            >
                <form className="space-y-4" onSubmit={handleUpdateAuthor}>
                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-tight">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input
                                required
                                className="w-full bg-white border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="e.g. Gabriel García Márquez"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-tight">Birth Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input
                                required
                                className="w-full bg-white border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                type="date"
                                value={formData.birthDate}
                                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold tracking-tight">Biography</label>
                        <textarea
                            required
                            className="w-full bg-white border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[120px]"
                            placeholder="Brief overview of the author's life and works..."
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Update Author</Button>
                    </div>
                </form>
            </Modal>

            {/* View Author Modal - Cập nhật giao diện theo hình ảnh */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Author Details"
                className="max-w-xl" // Chiều rộng vừa phải cho Dialog
            >
                {selectedAuthor && (
                    <div className="space-y-6 pt-2">
                        {/* Header Card với Avatar và Info */}
                        <div className="flex items-center gap-5 p-6 bg-white rounded-xl border border-border shadow-sm">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold text-2xl border border-slate-200">
                                {selectedAuthor.name.charAt(0)}
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                                    {selectedAuthor.name}
                                </h3>
                                <div className="flex items-center gap-2 text-slate-500 font-medium">
                                    <Calendar size={16} className="text-slate-400" />
                                    <span className="text-sm">Born: {selectedAuthor.birthDate}</span>
                                </div>
                            </div>
                        </div>

                        {/* Section Biography */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">
                                Biography
                            </h4>
                            <div className="p-5 bg-slate-50/50 rounded-xl border border-slate-100 italic text-slate-700 leading-relaxed text-sm">
                                "{selectedAuthor.bio}"
                            </div>
                        </div>

                        {/* Footer Timestamps - Grid layout 2 cột */}
                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    Created At
                                </span>
                                <p className="text-xs font-semibold text-slate-700">
                                    {new Date(selectedAuthor.createdAt).toLocaleString('en-US', {
                                        month: 'numeric', day: 'numeric', year: 'numeric',
                                        hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
                                    })}
                                </p>
                            </div>
                            <div className="space-y-1 text-right">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    Last Updated
                                </span>
                                <p className="text-xs font-semibold text-slate-700">
                                    {new Date(selectedAuthor.updatedAt).toLocaleString('en-US', {
                                        month: 'numeric', day: 'numeric', year: 'numeric',
                                        hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={() => setIsViewModalOpen(false)}
                                className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-8 py-2 rounded-lg font-bold transition-all"
                            >
                                Close Details
                            </Button>
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
                        Are you sure you want to delete <span className="font-bold text-foreground">{selectedAuthor?.name}</span>? This action cannot be undone and will remove all associated metadata.
                    </p>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Keep Author</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete Permanently</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}