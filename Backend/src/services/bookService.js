import Book from '../models/bookModel.js';

export const createBook = async (data) => {
    return await Book.create(data);
};

export const getAllBooks = async () => {
    return await Book.find().populate('authorId', 'name').sort({ createdAt: -1 });
};

export const getBookById = async (id) => {
    return await Book.findById(id).populate('authorId', 'name');
};

export const updateBook = async (id, data) => {
    return await Book.findByIdAndUpdate(id, data, { new: true });
};

export const deleteBook = async (id) => {
    return await Book.findByIdAndDelete(id);
};
