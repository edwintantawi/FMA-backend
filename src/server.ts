import mongoose from 'mongoose';
import { App } from './App';
import { CONFIG, ENV } from './config';

const server = new App({
  corsOptions: CONFIG.corsOptions,
});

const listenCallback = () => {
  const listenMessage = `Server : Server running succesfuly at http://localhost:${ENV.port}`;
  console.log(listenMessage);
};

// connect to database (MongoDB) and start server
mongoose.connect(ENV.mongoDbUrl, { dbName: ENV.mongoDbName });
mongoose.connection
  .on('open', () => {
    console.log('MonggoDB : Connection Success');
    server.listen(ENV.port, listenCallback);
  })
  .on('error', () => console.log('MonggoDB : Connection Error'));
