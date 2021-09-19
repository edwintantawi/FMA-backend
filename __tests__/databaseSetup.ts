import mongoose, { Collection } from 'mongoose';
import { ENV } from '../src/config';

export const setupTestDatabase = (): void => {
  beforeAll(async () => {
    await mongoose.connect(ENV.mongoDbUrl, { dbName: ENV.mongoDbName });
  });

  beforeEach(async () => {
    const collections = Object.values(mongoose.connection.collections).map(
      (collection: Collection) => collection.deleteMany({})
    );
    await Promise.all(collections);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
};
