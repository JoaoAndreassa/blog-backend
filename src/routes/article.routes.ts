import { Router } from 'express';
import multer from 'multer';
import { verifyToken } from '../middlewares/auth.middleware';
import {
  createArticleController,
  deleteArticleController,
  getAllArticlesController,
  getArticleByIdController,
  getArticleImageController,
  updateArticleController,
} from '../controllers/article.controller';

const router = Router();
const upload = multer();

router.post('/', verifyToken, upload.single('image'), createArticleController);
router.get('/', getAllArticlesController);
router.get('/:id', getArticleByIdController);
router.get('/:id/image', getArticleImageController);
router.put('/:id', verifyToken, upload.single('image'), updateArticleController);
router.delete('/:id', verifyToken, deleteArticleController);

export default router;
