import request from 'supertest';
import { CONFIG } from '../../src/config';
import { TokenModel, UserModel } from '../../src/models';
import { EMessages, IPublicUserData, IResponse } from '../../src/typings';
import { Cookies } from '../../src/utils';
import { app } from '../appSetup';
import {
  AuthHelper,
  CookiesHelper,
  DatabaseHelper,
  endpoints,
  mockUser,
} from '../helpers';

beforeAll(async () => {
  await DatabaseHelper.disconnectDB();
  await DatabaseHelper.connectDB();
});

afterAll(async () => {
  await DatabaseHelper.dropDB();
  await DatabaseHelper.disconnectDB();
});

describe(`Test auth endpoint [GET | ${endpoints.AUTH}]`, () => {
  beforeEach(async () => {
    await AuthHelper.registerUser(app, mockUser);
  });

  afterEach(async () => {
    await UserModel.deleteMany();
  });

  it('should error if tokens not exist', async () => {
    const response = await request(app).get(endpoints.AUTH);

    const { statusCode, body, headers } = response;
    const { error, message, data } = body as IResponse;
    const cookies = Cookies.getCookies(headers['set-cookie']);
    const { accessToken, refreshToken } =
      CookiesHelper.getTokenCookies(cookies);

    expect(message).toBe(EMessages.ERR_AUTH_TOKEN_NOT_FOUND);
    expect(statusCode).toBe(401);
    expect(error).toBeTruthy();
    expect(data).toBe(null);
    // token cookies
    expect(accessToken).toBeFalsy();
    expect(refreshToken).toBeFalsy();
  });

  it('should error if access token and refresh token invalid', async () => {
    const tokenCookies = ['accessToken=123', 'refreshToken=321'];
    const response = await request(app)
      .get(endpoints.AUTH)
      .set('Cookie', tokenCookies);

    const { statusCode, body, headers } = response;
    const { error, message, data } = body as IResponse;
    const cookies = Cookies.getCookies(headers['set-cookie']);

    const { accessToken, refreshToken } =
      CookiesHelper.getTokenCookies(cookies);

    expect(message).toBe(EMessages.ERR_AUTH_TOKEN);
    expect(statusCode).toBe(401);
    expect(error).toBeTruthy();
    expect(data).toBe(null);

    // token cookies
    expect(accessToken).toBeFalsy();
    expect(refreshToken).toBeFalsy();
  });

  it('should error if refresh token multiple times used', async () => {
    const responseLogin = await AuthHelper.loginUser(app, {
      email: mockUser.email,
      password: mockUser.password,
    });

    const loginCookies = Cookies.getCookies(
      responseLogin.headers['set-cookie']
    );

    const { refreshToken: loginRefreshToken } =
      CookiesHelper.getTokenCookies(loginCookies);

    // mimic miltiple use token
    await TokenModel.updateOne(
      {
        token: loginRefreshToken,
        uid: responseLogin.body.data.uid,
      },
      { isUsed: true }
    );

    const response = await request(app)
      .get(endpoints.AUTH)
      .set('Cookie', [
        `${CONFIG.jwtAccessTokenName}=invalidaccesstoken`,
        `${CONFIG.jwtRefreshTokenName}=${loginRefreshToken}`,
      ]);

    const { statusCode, body, headers } = response;
    const { error, message, data } = body as IResponse;
    const cookies = Cookies.getCookies(headers['set-cookie']);

    const { accessToken, refreshToken } =
      CookiesHelper.getTokenCookies(cookies);

    expect(message).toBe(EMessages.ERR_AUTH_TOKEN_REUSE);
    expect(statusCode).toBe(401);
    expect(error).toBeTruthy();
    expect(data).toBe(null);

    // token cookies
    expect(accessToken).toBeFalsy();
    expect(refreshToken).toBeFalsy();
  });

  it('should error if refresh token user is not found', async () => {
    const responseLogin = await AuthHelper.loginUser(app, {
      email: mockUser.email,
      password: mockUser.password,
    });

    const loginCookies = Cookies.getCookies(
      responseLogin.headers['set-cookie']
    );

    const { refreshToken: loginRefreshToken } =
      CookiesHelper.getTokenCookies(loginCookies);

    await UserModel.deleteOne({
      id: responseLogin.body.data.uid,
    });

    const response = await request(app)
      .get(endpoints.AUTH)
      .set('Cookie', [
        `${CONFIG.jwtAccessTokenName}=invalidaccesstoken`,
        `${CONFIG.jwtRefreshTokenName}=${loginRefreshToken}`,
      ]);

    const { statusCode, body, headers } = response;
    const { error, message, data } = body as IResponse;
    const cookies = Cookies.getCookies(headers['set-cookie']);

    const { accessToken, refreshToken } =
      CookiesHelper.getTokenCookies(cookies);

    expect(message).toBe(EMessages.ERR_USER_NOT_FOUND);
    expect(statusCode).toBe(401);
    expect(error).toBeTruthy();
    expect(data).toBe(null);

    // token cookies
    expect(accessToken).toBeFalsy();
    expect(refreshToken).toBeFalsy();
  });

  it('should success auth if access token is invalid but refresh token is valid and regenerate token', async () => {
    const responseLogin = await AuthHelper.loginUser(app, {
      email: mockUser.email,
      password: mockUser.password,
    });

    const loginCookies = Cookies.getCookies(
      responseLogin.headers['set-cookie']
    );

    const { accessToken: loginAccessToken, refreshToken: loginRefreshToken } =
      CookiesHelper.getTokenCookies(loginCookies);

    // mimic multiple token not used
    await TokenModel.create([
      { token: 'abc', uid: responseLogin.body.data.uid, isUsed: false },
      { token: 'xyz', uid: responseLogin.body.data.uid, isUsed: false },
    ]);

    const response = await request(app)
      .get(endpoints.AUTH)
      .set('Cookie', [
        `${CONFIG.jwtAccessTokenName}=invalidaccesstoken`,
        `${CONFIG.jwtRefreshTokenName}=${loginRefreshToken}`,
      ]);

    const { statusCode, body, headers } = response;
    const { error, message, data } = body as IResponse;
    const cookies = Cookies.getCookies(headers['set-cookie']);

    const { accessToken, refreshToken } =
      CookiesHelper.getTokenCookies(cookies);

    expect(message).toBe(EMessages.OK_AUTH);
    expect(statusCode).toBe(200);
    expect(error).toBeFalsy();

    const expectData: IPublicUserData = {
      uid: data.uid,
      farm: mockUser.farm,
      name: mockUser.name,
      email: mockUser.email,
    };

    expect(data).toStrictEqual(expectData);

    const unUsedToken = await TokenModel.find({ uid: data.uid, isUsed: false });
    expect(unUsedToken).toHaveLength(1);

    // token cookies
    expect(accessToken).toBeTruthy();
    expect(refreshToken).toBeTruthy();

    expect(loginAccessToken !== accessToken).toBeTruthy();
    expect(loginRefreshToken !== refreshToken).toBeTruthy();
  });

  // it('should error if access token user is not found', async () => { }

  // it('should success if access token is valid', async () => {})
});
