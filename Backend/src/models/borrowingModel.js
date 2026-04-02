import mongoose from 'mongoose';

const borrowingSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    borrowerName: {
        type: String,
        required: true,
        trim: true
    },
    borrowDate: {
        type: String, // YYYY-MM-DD
        required: true
    },
    status: {
        type: String,
        enum: ['Borrowed', 'Returned'],
        default: 'Borrowed'
    }
}, {
    timestamps: true
});

const Borrowing = mongoose.model('Borrowing', borrowingSchema);
export default Borrowing;
