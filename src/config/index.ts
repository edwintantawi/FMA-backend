import { CorsOptions } from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const { env } = process;

const ENV = {
  port: env.PORT || 5000,
  appOrigin: env.APP_ORIGIN || '',
  mongoDbName: env.MONGO_DB_NAME || 'unknown',
  mongoDbUrl: env.MONGO_DB_URL || '',
  bcryptSaltSize: parseInt(env.BCRYPT_SALT_SIZE || '0', 10),
  jwtAccessTokenKey: env.JWT_ACCESS_TOKEN_KEY || '',
  jwtRefreshTokenKey: env.JWT_REFRESH_TOKEN_KEY || '',
};

const corsOptions: CorsOptions = {
  origin: ['http://localhost:3000', ENV.appOrigin],
  credentials: true,
};

const jwtOptions = {
  jwtAccessTokenName: 'AccessToken',
  jwtRefreshTokenName: 'RefreshToken',
  jwtAccesTokenExpired: 1000 * 10, // 10 seconds
  jwtRefreshTokenExpired: 1000 * 60 * 60 * 24 * 31, // 31 days
};

export const CONFIG = {
  corsOptions,
  ...jwtOptions,
  ...ENV,
};
