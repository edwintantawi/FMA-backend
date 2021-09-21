import { Schema, model, Document } from 'mongoose';
import { IUser } from '../typings';

interface IUserModel extends IUser, Document {}

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

export const UserModel = model<IUserModel>('Users', UserSchema);
