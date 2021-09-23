import { CONFIG } from '../../src/config';
import { IKeyValue } from '../../src/typings';

interface ITokens {
  accessToken: string | undefined;
  refreshToken: string | undefined;
}

export class CookiesHalper {
  static getTokenCookies(cookies: IKeyValue[]): ITokens {
    const accessToken = cookies.find(
      (cookie) => cookie.key === CONFIG.jwtAccessTokenName
    )?.value;

    const refreshToken = cookies.find(
      (cookie) => cookie.key === CONFIG.jwtRefreshTokenName
    )?.value;

    return { accessToken, refreshToken };
  }
}
