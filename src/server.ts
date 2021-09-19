/* eslint-disable import/first */
import moduleAlias from 'module-alias';

moduleAlias.addAliases({
  '@app': `${__dirname}`,
  '@models': `${__dirname}/models`,
  '@views': `${__dirname}/views`,
  '@controllers': `${__dirname}/controllers`,
  '@routes': `${__dirname}/routes`,
  '@helpers': `${__dirname}/helpers`,
  '@config': `${__dirname}/config`,
});

import mongoose from 'mongoose';
import { App } from '@app/App';
import { CONFIG, ENV } from '@config/index';

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
