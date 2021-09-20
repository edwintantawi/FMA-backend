import { Request, Response } from 'express';
import { DataValidator } from '../helpers/DataValidator';
import { UserModel } from '../models';
import {
  EMessages,
  IPublicUserData,
  IRegister,
  IResponse,
  IUser,
} from '../typings';

export class AuthController {
  static async register(req: Request, res: Response) {
    const { farm, email, name, password, confirmPassword }: IRegister =
      req.body;

    // if require data not exists
    if (!farm || !email || !name || !password || !confirmPassword) {
      const response: IResponse = {
        error: true,
        message: EMessages.ERR_BAD_REQUEST,
        data: null,
      };
      return res.status(401).json(response);
    }

    // validate data
    if (
      !DataValidator.validateEmail(email) ||
      !DataValidator.compare(password, confirmPassword) ||
      !DataValidator.validateLength(farm, { minLength: 2, maxLength: 20 }) ||
      !DataValidator.validateLength(name, { minLength: 2, maxLength: 20 }) ||
      !DataValidator.validateLength(password, { minLength: 8, maxLength: 20 })
    ) {
      const response: IResponse = {
        error: true,
        message: EMessages.ERR_BAD_DATA,
        data: null,
      };
      return res.status(401).json(response);
    }

    try {
      // create user
      // TODO: Hash password
      const userDoc: IUser = { farm, name, email, password };
      const user = await UserModel.create(userDoc);

      const data: IPublicUserData = {
        uid: user._id,
        farm: user.farm,
        name: user.name,
        email: user.email,
      };

      const response: IResponse = {
        error: false,
        message: EMessages.OK_REGISTER,
        data,
      };

      return res.status(201).json(response);
    } catch (error: any) {
      const response: IResponse = {
        error: true,
        message: EMessages.ERR_SERVER,
        data: error,
      };

      // user already exist
      if (error.code === 11000) {
        response.data = null;
        response.message = EMessages.ERR_USER_EXIST;
        return res.status(401).json(response);
      }

      // server error
      return res.status(500).json(response);
    }
  }
}
