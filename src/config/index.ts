import { CorsOptions } from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const { env } = process;

export const ENV = {
  port: env.PORT || 5000,
  appOrigin: env.APP_ORIGIN || '',
  mongoDbName: env.MONGO_DB_NAME || 'unknown',
  mongoDbUrl: env.MONGO_DB_URL || '',
  bcryptSaltSize: env.BCRYPT_SALT_SIZE || 0,
  jwtAccessTokenKey: env.JWT_ACCESS_TOKEN_KEY || '',
  jwtRefreshTokenKey: env.JWT_REFRESH_TOKEN_KEY || '',
};

const corsOptions: CorsOptions = {
  origin: ['http://localhost:3000', ENV.appOrigin],
  credentials: true,
};

export const CONFIG = {
  corsOptions,
};
