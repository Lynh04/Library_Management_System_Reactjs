import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    totalStock: {
        type: Number,
        required: true,
        default: 0
    },
    availableStock: {
        type: Number,
        required: true,
        default: 0
    },
    publishedYear: {
        type: Number
    }
}, {
    timestamps: true
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
