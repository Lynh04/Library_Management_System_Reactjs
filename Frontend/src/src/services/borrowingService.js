import api from './api';

export const borrowingService = {
    getAll: async () => {
        const response = await api.get('/borrowings');
        return response.data.data;
    },
    create: async (data) => {
        const response = await api.post('/borrowings', data);
        return response.data.data;
    },
    returnBook: async (id) => {
        const response = await api.patch(`/borrowings/${id}/return`);
        return response.data.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/borrowings/${id}`);
        return response.data;
    }
};
