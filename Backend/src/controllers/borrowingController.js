import * as borrowingService from '../services/borrowingService.js';
import { success, error } from '../utils/response.js';

export const create = async (req, res) => {
    try {
        const borrowing = await borrowingService.createBorrowing(req.body);
        return success(res, 'Loan confirmed successfully', borrowing, 201);
    } catch (err) {
        return error(res, 'Error creating loan', 500, err.message);
    }
};

export const getAll = async (req, res) => {
    try {
        const borrowings = await borrowingService.getAllBorrowings();
        return success(res, 'Borrowings fetched successfully', borrowings);
    } catch (err) {
        return error(res, 'System error', 500, err.message);
    }
};

export const handleReturn = async (req, res) => {
    try {
        const borrowing = await borrowingService.returnBook(req.params.id);
        if (!borrowing) return error(res, 'Borrowing record not found', 404, 'RECORD_NOT_FOUND');
        return success(res, 'Book returned successfully', borrowing);
    } catch (err) {
        return error(res, 'Return failed', 500, err.message);
    }
};

export const remove = async (req, res) => {
    try {
        await borrowingService.deleteBorrowing(req.params.id);
        return success(res, 'Record removed successfully');
    } catch (err) {
        return error(res, 'Deletion failed', 500, err.message);
    }
};
