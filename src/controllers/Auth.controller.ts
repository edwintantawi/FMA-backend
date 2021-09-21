import { Request, Response } from 'express';
import { DataValidator, Bcrypt } from '../helpers';
import { UserModel } from '../models';
import {
  EMessages,
  ILogin,
  IPublicUserData,
  IRegister,
  IResponse,
  IUser,
} from '../typings';

export class AuthController {
  static async register(req: Request, res: Response) {
    const { farm, email, name, password, confirmPassword } =
      req.body as IRegister;

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
      !DataValidator.compareString(password, confirmPassword) ||
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
      // Hash password
      const encryptedPassword = Bcrypt.encryptPassword(password);
      const userDoc: IUser = { farm, name, email, password: encryptedPassword };

      // create user
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
        response.message = EMessages.ERR_USER_ALREADY_EXIST;
        return res.status(401).json(response);
      }

      // server error
      return res.status(500).json(response);
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body as ILogin;

    // if require data not exists
    if (!email || !password) {
      const response: IResponse = {
        error: true,
        message: EMessages.ERR_BAD_DATA,
        data: null,
      };
      return res.status(401).json(response);
    }

    // check user
    const user = await UserModel.findOne({ email });
    if (!user) {
      const response: IResponse = {
        error: true,
        message: EMessages.ERR_LOGIN_USER_NOT_FOUND,
        data: null,
      };
      return res.status(401).json(response);
    }

    // check password
    const isMatchPassword = Bcrypt.comparePassword(password, user.password);

    if (!isMatchPassword) {
      const response: IResponse = {
        error: true,
        message: EMessages.ERR_LOGIN_WRONG_PASSWORD,
        data: null,
      };
      return res.status(401).json(response);
    }

    // TODO: Create access & refresh token
    // TODO: Save refresh token to db
    // TODO: Serve access & refresh token to client

    return res.status(200).json({ message: 'ok' });
  }
}
