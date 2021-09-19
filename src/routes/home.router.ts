import express from 'express';
import { HomeController } from '@controllers/Home.controller';

const router = express.Router();

router.get('/', HomeController.renderHomePage);

export default router;
