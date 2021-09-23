import mongoose from 'mongoose';
import { App } from './App';
import { CONFIG } from './config';

const server = new App({
  corsOptions: CONFIG.corsOptions,
});

const listenCallback = () => {
  const listenMessage = `Server : Server running succesfuly at http://localhost:${CONFIG.port}`;
  console.log(listenMessage);
};

// connect to database (MongoDB) and start server
mongoose.connect(CONFIG.mongoDbUrl, { dbName: CONFIG.mongoDbName });
mongoose.connection
  .on('open', () => {
    console.log('MonggoDB : Connection Success');
    server.listen(CONFIG.port, listenCallback);
  })
  .on('error', () => console.log('MonggoDB : Connection Error'));
