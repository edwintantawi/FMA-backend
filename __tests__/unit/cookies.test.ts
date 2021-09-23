import { Cookies } from '../../src/utils';

describe('Test Cookie method', () => {
  it('should return empty array if input is invalid [getCookies()]', () => {
    const mockCookiesHeader = undefined;
    const cookies = Cookies.getCookies(mockCookiesHeader);

    expect(cookies).toStrictEqual([]);
  });
  it('should get cookies from string headers cookie [getCookies()]', () => {
    const mockCookiesHeader = [
      'accessToken=accesstokenhere; Path=/',
      'refreshToken=refreshtokenhere; Path=/',
    ];
    const cookies = Cookies.getCookies(mockCookiesHeader);
    const expectData = [
      { key: 'accessToken', value: 'accesstokenhere' },
      { key: 'refreshToken', value: 'refreshtokenhere' },
    ];
    expect(cookies).toStrictEqual(expectData);
  });
});
