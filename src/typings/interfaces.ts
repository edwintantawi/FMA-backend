import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

export interface ILogin {
  email: string;
  password: string;
}

export interface IUser extends ILogin {
  farm: string;
  name: string;
}

export interface IRegister extends IUser, ILogin {
  confirmPassword: string;
}

export interface IResponse {
  error: boolean;
  message: string;
  data: any;
}

export interface IPublicUserData extends Omit<IUser, 'password'> {
  uid: string;
}

export interface IDecoded extends JwtPayload, IPublicUserData {}

export interface ITokenDB {
  uid: string;
  token: string;
  isUsed?: boolean;
}

export interface IKeyValue {
  key: string;
  value: string;
}

export interface extendRequest extends Request {
  authPayload?: IPublicUserData;
}

export interface IAuthToken {
  accessToken: string | undefined;
  refreshToken: string | undefined;
}
