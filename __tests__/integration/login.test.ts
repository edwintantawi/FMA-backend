import request from 'supertest';
import { UserModel } from '../../src/models';
import { EMessages, ILogin, IResponse } from '../../src/typings';
import { app } from '../appSetup';
import { DatabaseHelper, endpoints, mockUser } from '../helpers';

beforeAll(async () => {
  await DatabaseHelper.disconnectDB();
  await DatabaseHelper.connectDB();
  await UserModel.create(mockUser);
});

afterAll(async () => {
  await DatabaseHelper.dropDB();
  await DatabaseHelper.disconnectDB();
});

describe(`Test auth login endpoint [POST | ${endpoints.AUTH_LOGIN}]`, () => {
  it('should error if email data not exist', async () => {
    const reqBody: ILogin = { ...mockUser, email: '' };

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
    const reqBody: ILogin = { ...mockUser, password: '' };

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
    const reqBody: ILogin = { ...mockUser, email: 'anothernewuser@user.com' };

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
    const reqBody: ILogin = { ...mockUser, password: 'notmatchpassword' };

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

  // TODO: add test
  // it('should success login and get token cookies', async () => {});
});
