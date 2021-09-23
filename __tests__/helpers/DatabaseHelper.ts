/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import mongoose from 'mongoose';
import { CONFIG } from '../../src/config';

export class DatabaseHelper {
  static async connectDB() {
    await mongoose.connect(CONFIG.mongoDbUrl, { dbName: CONFIG.mongoDbName });
  }

  static async clearCollections() {
    const collections = await mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      collection.deleteMany({});
    }
  }

  static async dropDB() {
    await mongoose.connection.dropDatabase();
  }

  static async disconnectDB() {
    await mongoose.connection.close(true);
    await mongoose.disconnect();
  }
}
