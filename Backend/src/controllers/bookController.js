import * as bookService from '../services/bookService.js';
import { success, error } from '../utils/response.js';

export const create = async (req, res) => {
    try {
        const book = await bookService.createBook(req.body);
        return success(res, 'Book cataloged successfully', book, 201);
    } catch (err) {
        return error(res, 'Error cataloging book', 500, err.message);
    }
};

export const getAll = async (req, res) => {
    try {
        const books = await bookService.getAllBooks();
        return success(res, 'Books fetched successfully', books);
    } catch (err) {
        return error(res, 'System error', 500, err.message);
    }
};

export const getDetail = async (req, res) => {
    try {
        const book = await bookService.getBookById(req.params.id);
        if (!book) return error(res, 'Book not found', 404, 'BOOK_NOT_FOUND');
        return success(res, 'Book details fetched', book);
    } catch (err) {
        return error(res, 'System error', 500, err.message);
    }
};

export const update = async (req, res) => {
    try {
        const book = await bookService.updateBook(req.params.id, req.body);
        if (!book) return error(res, 'Book not found', 404, 'BOOK_NOT_FOUND');
        return success(res, 'Book updated successfully', book);
    } catch (err) {
        return error(res, 'Update failed', 500, err.message);
    }
};

export const remove = async (req, res) => {
    try {
        await bookService.deleteBook(req.params.id);
        return success(res, 'Book removed successfully');
    } catch (err) {
        return error(res, 'Deletion failed', 500, err.message);
    }
};
