// src/routes/user.js
import express from 'express';
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách user
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/users', (req, res) => {
    res.json([{ id: 1, name: 'A' }]);
});

export default router;