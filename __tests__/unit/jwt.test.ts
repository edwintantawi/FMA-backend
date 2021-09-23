import { Jwt } from '../../src/utils';
import { IPublicUserData } from '../../src/typings';
import { mockUser } from '../helpers';
import { CONFIG } from '../../src/config';

describe('Test JWT method', () => {
  it('should return valid accessToken and refreshToken', () => {
    const payload: IPublicUserData = {
      uid: 'excampleuid',
      farm: mockUser.farm,
      name: mockUser.name,
      email: mockUser.email,
    };
    const { accessToken, refreshToken } = Jwt.createTokens(payload);
    expect(typeof accessToken).toBe('string');
    expect(typeof refreshToken).toBe('string');

    const accessTokenPayload = Jwt.vertifyToken(
      accessToken,
      CONFIG.jwtAccessTokenKey
    );
    const refreshTokenPayload = Jwt.vertifyToken(
      refreshToken,
      CONFIG.jwtRefreshTokenKey
    );

    expect(accessTokenPayload).toMatchObject(payload);
    expect(refreshTokenPayload).toMatchObject(payload);
  });
});
