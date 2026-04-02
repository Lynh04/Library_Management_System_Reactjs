import express from 'express';
import { create, getAll, handleReturn, remove } from '../controllers/borrowingController.js';

const router = express.Router();

router.post('/', create);
router.get('/', getAll);
router.patch('/:id/return', handleReturn);
router.delete('/:id', remove);

export default router;
