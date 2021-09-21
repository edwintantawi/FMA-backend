import { Application } from 'express';
import homeRouter from './home.router';
import authRouter from './auth.router';

export class AppRoutes {
  constructor(private app: Application) {}

  setup(): void {
    this.app.use('/', homeRouter);
    this.app.use('/api/v1/auth', authRouter);
  }
}
