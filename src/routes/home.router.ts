import express from 'express';
import { HomeController } from '../controllers';

const router = express.Router();

router.get('/', HomeController.renderHomePage);

export default router;
