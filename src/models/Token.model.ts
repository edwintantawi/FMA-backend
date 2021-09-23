import { Schema, model } from 'mongoose';
import { ITokenDB } from '../typings';

interface ITokenModel extends ITokenDB, Document {}

const TokenSchema = new Schema(
  {
    uid: {
      required: true,
      type: String,
    },
    token: {
      required: true,
      type: String,
    },
    isUsed: {
      required: false,
      default: false,
      type: Boolean,
    },
  },
  { timestamps: true }
);

export const TokenModel = model<ITokenModel>('Tokens', TokenSchema);
