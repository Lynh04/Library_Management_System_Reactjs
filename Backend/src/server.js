import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import { swaggerDocs } from './swagger.js';
import projectRoutes from './routes/projectRoutes.js';
import authorRoutes from './routes/authorRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import borrowingRoutes from './routes/borrowingRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Database Connection
connectDB();

// CORS Configuration
const allowedOrigins = [
    "http://localhost:3000",      // Your Vite Frontend
    "https://app.com",            // Production App
    "https://admin.app.com"       // Production Admin
];


app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

// Standard Middlewares
app.use(express.json());

// API Documentation
swaggerDocs(app);

// Routes
// All requests starting with /api/users will go to userRoutes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrowings', borrowingRoutes);

// Root route for status check
app.get('/', (req, res) => {
    res.json({ message: "Library Management System API is running" });
});

// Server Initialization
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    console.log(`📖 API Documentation available at http://localhost:${PORT}/api-docs`);
});