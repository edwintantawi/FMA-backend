import request from 'supertest';
import { CONFIG } from '../../src/config';
import { EMessages, ILogin, IResponse } from '../../src/typings';
import { Cookies } from '../../src/utils';
import { app } from '../appSetup';
import {
  AuthHelper,
  CookiesHalper,
  DatabaseHelper,
  endpoints,
  mockUser,
} from '../helpers';

beforeAll(async () => {
  await DatabaseHelper.disconnectDB();
  await DatabaseHelper.connectDB();
  // register initial user
  await AuthHelper.registerUser(app, mockUser);
});

afterAll(async () => {
  await DatabaseHelper.dropDB();
  await DatabaseHelper.disconnectDB();
});

describe(`Test auth endpoint [GET | ${endpoints.AUTH}]`, () => {
  it('should error if tokens not exist', async () => {
    const response = await request(app).get(endpoints.AUTH);

    const { statusCode, body, headers } = response;
    const { error, message, data } = body as IResponse;

    expect(message).toBe(EMessages.ERR_AUTH_TOKEN_NOT_FOUND);
    expect(statusCode).toBe(401);
    expect(error).toBeTruthy();
    expect(data).toBe(null);

    const cookies = Cookies.getCookies(headers['set-cookie']);

    const { accessToken, refreshToken } =
      CookiesHalper.getTokenCookies(cookies);

    expect(accessToken).toBeFalsy();
    expect(refreshToken).toBeFalsy();
  });

  // it('should error if access token and refresh token invalid', async () => {
  //   const reqBody: ILogin = {
  //     email: mockUser.email,
  //     password: mockUser.password,
  //   };

  //   const loginResponse = await AuthHelper.loginUser(app, reqBody);

  //   const response = await request(app)
  //     .get(endpoints.AUTH)
  //     .set('Cookie', [...loginResponse.headers['set-cookie']]);

  //   const { statusCode, body, headers } = response;
  //   const { error, message, data } = body as IResponse;
  //   const cookies = Cookies.getCookies(headers['set-cookie']);
  //   const { accessToken, refreshToken } =
  //     CookiesHalper.getTokenCookies(cookies);

  //   expect(message).toBe(EMessages.ERR_AUTH_TOKEN);
  //   expect(statusCode).toBe(401);
  //   expect(error).toBeFalsy();
  //   expect(data).toBe(null);

  //   expect(accessToken).toBeFalsy();
  //   expect(refreshToken).toBeFalsy();
  // });

  // it('should error if refresh token multiple times used', async () => {});
});
