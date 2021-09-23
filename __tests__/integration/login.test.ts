import request from 'supertest';
import { CONFIG } from '../../src/config';
import {
  EMessages,
  ILogin,
  IResponse,
  IPublicUserData,
} from '../../src/typings';
import { Cookies } from '../../src/utils';
import { app } from '../appSetup';
import { AuthHelper, DatabaseHelper, endpoints, mockUser } from '../helpers';

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

describe(`Test auth login endpoint [POST | ${endpoints.AUTH_LOGIN}]`, () => {
  it('should error if email data not exist', async () => {
    const reqBody: ILogin = { email: '', password: mockUser.password };

    const response = await request(app)
      .post(endpoints.AUTH_LOGIN)
      .send(reqBody);

    const { statusCode, body } = response;
    const { error, message, data } = body as IResponse;

    expect(message).toBe(EMessages.ERR_BAD_DATA);
    expect(statusCode).toBe(401);
    expect(error).toBeTruthy();
    expect(data).toBe(null);
  });

  it('should error if password data not exist', async () => {
    const reqBody: ILogin = { email: mockUser.email, password: '' };

    const response = await request(app)
      .post(endpoints.AUTH_LOGIN)
      .send(reqBody);

    const { statusCode, body } = response;
    const { error, message, data } = body as IResponse;

    expect(message).toBe(EMessages.ERR_BAD_DATA);
    expect(statusCode).toBe(401);
    expect(error).toBeTruthy();
    expect(data).toBe(null);
  });

  it('should error if user not exist', async () => {
    const reqBody: ILogin = {
      email: 'anothernewuser@user.com',
      password: mockUser.password,
    };

    const response = await request(app)
      .post(endpoints.AUTH_LOGIN)
      .send(reqBody);

    const { statusCode, body } = response;
    const { error, message, data } = body as IResponse;

    expect(message).toBe(EMessages.ERR_LOGIN_USER_NOT_FOUND);
    expect(statusCode).toBe(401);
    expect(error).toBeTruthy();
    expect(data).toBe(null);
  });

  it('should error if password not match', async () => {
    const reqBody: ILogin = {
      email: mockUser.email,
      password: 'notmatchpassword',
    };

    const response = await request(app)
      .post(endpoints.AUTH_LOGIN)
      .send(reqBody);

    const { statusCode, body } = response;
    const { error, message, data } = body as IResponse;

    expect(message).toBe(EMessages.ERR_LOGIN_WRONG_PASSWORD);
    expect(statusCode).toBe(401);
    expect(error).toBeTruthy();
    expect(data).toBe(null);
  });

  it('should success login and get token cookies', async () => {
    const reqBody: ILogin = {
      email: mockUser.email,
      password: mockUser.password,
    };

    const response = await request(app)
      .post(endpoints.AUTH_LOGIN)
      .send(reqBody);

    const { statusCode, body, headers } = response;
    const { error, message, data } = body as IResponse;
    const cookies = Cookies.getCookies(headers['set-cookie']);

    expect(message).toBe(EMessages.OK_LOGIN);
    expect(statusCode).toBe(200);
    expect(error).toBeFalsy();

    const expectData: IPublicUserData = {
      uid: data.uid,
      farm: mockUser.farm,
      name: mockUser.name,
      email: mockUser.email,
    };

    expect(data).toStrictEqual(expectData);

    const accessTokenCookie = cookies.find(
      (cookie) => cookie.key === CONFIG.jwtAccessTokenName
    );

    const refreshTokenCookie = cookies.find(
      (cookie) => cookie.key === CONFIG.jwtRefreshTokenName
    );

    expect(accessTokenCookie?.value).toBeTruthy();
    expect(refreshTokenCookie?.value).toBeFalsy();
  });
});
