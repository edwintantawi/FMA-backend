/* eslint-disable class-methods-use-this */
import jsonWebToken, { JwtPayload } from 'jsonwebtoken';
import { CONFIG } from '../config';

interface IVertifyTokenResult {
  error: boolean;
  errorName: null | string;
  payload: JwtPayload | null;
}

export class Jwt {
  static createTokens(payload: any) {
    const accessToken = this.createAccessToken(payload);
    const refreshToken = this.createRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  static vertifyToken(token: string, key: string): IVertifyTokenResult {
    const result: IVertifyTokenResult = {
      error: true,
      errorName: null,
      payload: null,
    };

    jsonWebToken.verify(token, key, (error, decoded) => {
      if (error) {
        result.errorName = error.name;
      }
      if (decoded) {
        result.error = false;
        result.payload = decoded;
      }
    });

    return result;
  }

  static createAccessToken(payload: any) {
    const accessToken = jsonWebToken.sign(payload, CONFIG.jwtAccessTokenKey, {
      expiresIn: CONFIG.jwtAccesTokenExpired,
    });
    return accessToken;
  }

  static createRefreshToken(payload: any) {
    const refreshToken = jsonWebToken.sign(payload, CONFIG.jwtRefreshTokenKey, {
      expiresIn: CONFIG.jwtRefreshTokenExpired,
    });
    return refreshToken;
  }
}
