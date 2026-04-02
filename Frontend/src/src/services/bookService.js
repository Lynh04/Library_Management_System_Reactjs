import api from './api';

export const bookService = {
    getAll: async () => {
        const response = await api.get('/books');
        return response.data.data;
    },
    create: async (data) => {
        const response = await api.post('/books', data);
        return response.data.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/books/${id}`, data);
        return response.data.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/books/${id}`);
        return response.data;
    }
};
