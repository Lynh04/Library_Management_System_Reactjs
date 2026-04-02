import Borrowing from '../models/borrowingModel.js';
import Book from '../models/bookModel.js';

export const createBorrowing = async (data) => {
    const borrowing = await Borrowing.create(data);
    // Decrease stock
    await Book.findByIdAndUpdate(data.bookId, { $inc: { availableStock: -1 } });
    return borrowing;
};

export const getAllBorrowings = async () => {
    return await Borrowing.find().populate('bookId', 'title').sort({ createdAt: -1 });
};

export const returnBook = async (id) => {
    const borrowing = await Borrowing.findByIdAndUpdate(id, { status: 'Returned' }, { new: true });
    if (borrowing) {
        // Increase stock
        await Book.findByIdAndUpdate(borrowing.bookId, { $inc: { availableStock: 1 } });
    }
    return borrowing;
};

export const deleteBorrowing = async (id) => {
    return await Borrowing.findByIdAndDelete(id);
};
