import express from 'express';
import { AuthController } from '../controllers';
import { authMiddleware } from '../middlewares';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/', authMiddleware, AuthController.auth);

export default router;
