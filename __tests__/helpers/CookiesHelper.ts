import { CONFIG } from '../../src/config';
import { IAuthToken, IKeyValue } from '../../src/typings';

export class CookiesHelper {
  static getTokenCookies(cookies: IKeyValue[]): IAuthToken {
    const accessToken = cookies.find(
      (cookie) => cookie.key === CONFIG.jwtAccessTokenName
    )?.value;

    const refreshToken = cookies.find(
      (cookie) => cookie.key === CONFIG.jwtRefreshTokenName
    )?.value;

    return { accessToken, refreshToken };
  }
}
