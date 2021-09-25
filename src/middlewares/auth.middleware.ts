import { Response, NextFunction } from 'express';
import { CONFIG } from '../config';
import { TokenModel, UserModel } from '../models';
import {
  EMessages,
  extendRequest,
  IPublicUserData,
  IResponse,
} from '../typings';
import { Cookies, Jwt } from '../utils';

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
    Cookies.cleanTokenCookies(res);
    return res.status(401).json(response);
  }

  const vertifyAccess = Jwt.vertifyToken(accessToken, CONFIG.jwtAccessTokenKey);

  // TODO: valid access token
  if (!vertifyAccess.error && vertifyAccess.payload) {
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
    return next();
  }

  // invalid access token, use refresh token
  const vertifyRefresh = Jwt.vertifyToken(
    refreshToken,
    CONFIG.jwtRefreshTokenKey
  );

  // valid refresh token
  if (!vertifyRefresh.error && vertifyRefresh.payload) {
    const tokenPayload = vertifyRefresh.payload;
    // get db token
    const dbToken = await TokenModel.findOne({
      token: refreshToken,
      uid: tokenPayload.uid,
      isUsed: false,
    });

    // token used multiple times
    if (!dbToken) {
      const response: IResponse = {
        error: true,
        message: EMessages.ERR_AUTH_TOKEN_REUSE,
        data: null,
      };
      Cookies.cleanTokenCookies(res);
      return res.status(401).json(response);
    }

    // get user data
    const user = await UserModel.findOne({ id: tokenPayload.uid });
    if (!user) {
      const response: IResponse = {
        error: true,
        message: EMessages.ERR_USER_NOT_FOUND,
        data: null,
      };
      Cookies.cleanTokenCookies(res);
      return res.status(401).json(response);
    }

    // generate new token
    const payload: IPublicUserData = {
      uid: user._id,
      name: user.name,
      farm: user.farm,
      email: user.email,
    };

    // reset all tokens related to this user
    await TokenModel.updateMany(
      { uid: user._id, isUsed: false },
      { isUsed: true }
    );

    // generate new tokens
    const newAuthToken = Jwt.createTokens(payload);

    // save token to db
    await TokenModel.create({
      uid: user._id,
      token: newAuthToken.refreshToken,
      isUsed: false,
    });

    Cookies.setTokenCookies(res, newAuthToken);

    // inject payload to request
    req.authPayload = payload;
    return next();
  }

  const response: IResponse = {
    error: true,
    message: EMessages.ERR_AUTH_TOKEN,
    data: null,
  };
  Cookies.cleanTokenCookies(res);
  return res.status(401).json(response);
};
