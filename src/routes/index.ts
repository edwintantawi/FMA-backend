import { Application } from 'express';
import homeRouter from '@routes/home.router';

export class AppRoutes {
  constructor(private app: Application) {}

  setup(): void {
    this.app.use('/', homeRouter);
  }
}
