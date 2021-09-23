import { Response, NextFunction } from 'express';
import { CONFIG } from '../config';
import { UserModel } from '../models';
import {
  EMessages,
  extendRequest,
  IPublicUserData,
  IResponse,
} from '../typings';
import { Jwt } from '../utils';

export const authMiddleware = async (
  req: extendRequest,
  res: Response,
  next: NextFunction
) => {
  const { accessToken, refreshToken } = req.cookies;

  // if token not exists
  if (!accessToken || !refreshToken) {
    const response: IResponse = {
      error: true,
      message: EMessages.ERR_AUTH_TOKEN_NOT_FOUND,
      data: null,
    };
    return res.status(401).json(response);
  }

  const accessTokenPayload = Jwt.vertifyToken(
    accessToken,
    CONFIG.jwtAccessTokenKey
  );

  // valid access token
  if (accessTokenPayload) {
    // const user = await UserModel.findOne({ id: accessTokenPayload.uid });
    // if (!user) {
    //   const response: IResponse = {
    //     error: true,
    //     message: EMessages.ERR_AUTH_USER,
    //     data: null,
    //   };
    //   return res.status(401).json(response);
    // }
    // const userData: IPublicUserData = {
    //   uid: user._id,
    //   farm: user.farm,
    //   name: user.name,
    //   email: user.email,
    // };
    // req.userData = userData;
    // next();
  }

  // invalid access token, use refresh token
  const refreshTokenPayload = Jwt.vertifyToken(
    refreshToken,
    CONFIG.jwtRefreshTokenKey
  );

  if (refreshTokenPayload) {
    // TODO: get user data
    // TODO: check user
    // TODO: generate new token
  }

  return next();
};
