import { IKeyValue } from '../typings';

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
}
