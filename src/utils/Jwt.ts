/* eslint-disable class-methods-use-this */
import jsonWebToken from 'jsonwebtoken';
import { CONFIG } from '../config';
import { IDecoded } from '../typings';

export class Jwt {
  static createTokens(payload: any) {
    const accessToken = this.createAccessToken(payload);
    const refreshToken = this.createRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  static vertifyToken(token: string, key: string): IDecoded | null {
    let decodedData = null;
    jsonWebToken.verify(token, key, (error, decoded) => {
      if (!error) decodedData = decoded;
    });
    return decodedData;
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
