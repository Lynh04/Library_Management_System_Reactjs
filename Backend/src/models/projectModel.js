import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'], // Chỉ cho phép 3 trạng thái này
        default: 'pending'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    // 🔗 LIÊN KẾT VỚI BẢNG USER
    owner: {
        type: mongoose.Schema.Types.ObjectId, // Kiểu dữ liệu là ID của MongoDB
        ref: 'User', // Tham chiếu đến Model tên là 'User'
        required: true // Một dự án bắt buộc phải có người tạo
    }
}, {
    timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
export default Project;