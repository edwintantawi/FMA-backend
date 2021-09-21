import express from 'express';
import { AuthController } from '../controllers';

const router = express.Router();

router.post('/register', AuthController.register);

export default router;
