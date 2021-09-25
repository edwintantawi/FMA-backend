import { Response } from 'express';
import { CONFIG } from '../config';
import { IAuthToken, IKeyValue } from '../typings';

export class Cookies {
  static getCookies(stringCookies: string[] | undefined): IKeyValue[] {
    if (!stringCookies) return [];
    const cookies = stringCookies.map((cookie: string) => {
      const cookiePart = cookie.split(' ');
      const [key, value] = cookiePart[0].split('=');
      return { key, value: value.slice(0, -1) };
    });
    return cookies;
  }

  static cleanTokenCookies(res: Response): void {
    res.clearCookie(CONFIG.jwtAccessTokenName);
    res.clearCookie(CONFIG.jwtRefreshTokenName);
  }

  static setTokenCookies(res: Response, tokens: IAuthToken) {
    res.cookie(CONFIG.jwtAccessTokenName, tokens.accessToken);
    res.cookie(CONFIG.jwtRefreshTokenName, tokens.refreshToken);
  }
}
