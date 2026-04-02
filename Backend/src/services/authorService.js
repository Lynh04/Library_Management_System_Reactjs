import Author from '../models/authorModel.js';

export const createAuthor = async (data) => {
    return await Author.create(data);
};

export const getAllAuthors = async () => {
    return await Author.find().sort({ createdAt: -1 });
};

export const getAuthorById = async (id) => {
    return await Author.findById(id);
};

export const updateAuthor = async (id, data) => {
    return await Author.findByIdAndUpdate(id, data, { new: true });
};

export const deleteAuthor = async (id) => {
    return await Author.findByIdAndDelete(id);
};
