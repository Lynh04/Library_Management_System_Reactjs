import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        required: true
    },
    birthDate: {
        type: String, // String format as used in frontend (YYYY-MM-DD)
        required: true
    }
}, {
    timestamps: true
});

const Author = mongoose.model('Author', authorSchema);
export default Author;
