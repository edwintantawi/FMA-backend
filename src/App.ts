import path from 'path';
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import { Server } from 'http';
import helmet from 'helmet';
import { AppRoutes } from './routes';
import { TPort } from './typings';

interface IApp {
  corsOptions: CorsOptions;
}

export class App {
  private app: Application;

  private corsOptions: CorsOptions;

  constructor({ corsOptions }: IApp) {
    this.corsOptions = corsOptions;
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
  }

  get context(): Application {
    return this.app;
  }

  middlewares(): void {
    this.app.use(helmet());
    this.app.use(cors(this.corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(cookieParser());
  }

  settings(): void {
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'ejs');
  }

  routes(): void {
    const appRoutes = new AppRoutes(this.app);
    appRoutes.setup();
  }

  listen(port: TPort, callback: () => void): Server {
    return this.app.listen(port, callback);
  }
}
