import express from 'express';
import { create, getAll, getDetail } from '../controllers/projectController.js';

const router = express.Router();

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getDetail);

export default router;