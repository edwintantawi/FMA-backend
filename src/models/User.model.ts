import { Schema, model } from 'mongoose';
import { IUser } from '../typings';

const UserSchema = new Schema(
  {
    farm: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      unique: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>('Users', UserSchema);
