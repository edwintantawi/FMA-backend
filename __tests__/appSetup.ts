import { App } from '../src/App';
import { CONFIG } from '../src/config';

const application = new App({ corsOptions: CONFIG.corsOptions });
export const app = application.context;
