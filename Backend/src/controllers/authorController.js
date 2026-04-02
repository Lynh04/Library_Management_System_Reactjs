import * as authorService from '../services/authorService.js';
import { success, error } from '../utils/response.js';

export const create = async (req, res) => {
    try {
        const author = await authorService.createAuthor(req.body);
        return success(res, 'Author registered successfully', author, 201);
    } catch (err) {
        return error(res, 'Error creating author', 500, err.message);
    }
};

export const getAll = async (req, res) => {
    try {
        const authors = await authorService.getAllAuthors();
        return success(res, 'Authors fetched successfully', authors);
    } catch (err) {
        return error(res, 'System error', 500, err.message);
    }
};

export const getDetail = async (req, res) => {
    try {
        const author = await authorService.getAuthorById(req.params.id);
        if (!author) return error(res, 'Author not found', 404, 'AUTHOR_NOT_FOUND');
        return success(res, 'Author details fetched', author);
    } catch (err) {
        return error(res, 'System error', 500, err.message);
    }
};

export const update = async (req, res) => {
    try {
        const author = await authorService.updateAuthor(req.params.id, req.body);
        if (!author) return error(res, 'Author not found', 404, 'AUTHOR_NOT_FOUND');
        return success(res, 'Author updated successfully', author);
    } catch (err) {
        return error(res, 'Update failed', 500, err.message);
    }
};

export const remove = async (req, res) => {
    try {
        await authorService.deleteAuthor(req.params.id);
        return success(res, 'Author removed successfully');
    } catch (err) {
        return error(res, 'Deletion failed', 500, err.message);
    }
};
