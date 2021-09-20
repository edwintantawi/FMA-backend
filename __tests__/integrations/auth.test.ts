import request from 'supertest';
import {
  EMessages,
  IPublicUserData,
  IRegister,
  IResponse,
} from '../../src/typings';
import { app } from '../appSetup';
import { mockUser, endpoints, DatabaseHelper } from '../helpers';
import { AuthHelper } from '../helpers/AuthHelper';

beforeAll(async () => {
  await DatabaseHelper.disconnectDB();
  await DatabaseHelper.connectDB();
});

afterAll(async () => {
  await DatabaseHelper.dropDB();
  await DatabaseHelper.disconnectDB();
});

describe(`Test auth endpoint [POST | ${endpoints.AUTH_REGISTER}]`, () => {
  afterEach(async () => {
    await DatabaseHelper.clearCollections();
  });

  it('should error if farm data not exists', async () => {
    const reqBody: IRegister = { ...mockUser, farm: '' };

    const response = await request(app)
      .post(endpoints.AUTH_REGISTER)
      .send(reqBody);

    const { statusCode, body } = response;
    const { error, message, data }: IResponse = body;

    expect(message).toBe(EMessages.ERR_BAD_REQUEST);
    expect(error).toBe(true);
    expect(statusCode).toBe(401);
    expect(data).toBe(null);
  });

  it('should error if name data not exists', async () => {
    const reqBody: IRegister = { ...mockUser, name: '' };

    const response = await request(app)
      .post(endpoints.AUTH_REGISTER)
      .send(reqBody);

    const { statusCode, body } = response;
    const { error, message, data }: IResponse = body;

    expect(message).toBe(EMessages.ERR_BAD_REQUEST);
    expect(error).toBe(true);
    expect(statusCode).toBe(401);
    expect(data).toBe(null);
  });

  it('should error if email data not exists', async () => {
    const reqBody: IRegister = { ...mockUser, email: '' };

    const response = await request(app)
      .post(endpoints.AUTH_REGISTER)
      .send(reqBody);

    const { statusCode, body } = response;
    const { error, message, data }: IResponse = body;

    expect(message).toBe(EMessages.ERR_BAD_REQUEST);
    expect(error).toBe(true);
    expect(statusCode).toBe(401);
    expect(data).toBe(null);
  });

  it('should error if password data not exists', async () => {
    const reqBody: IRegister = { ...mockUser, password: '' };

    const response = await request(app)
      .post(endpoints.AUTH_REGISTER)
      .send(reqBody);

    const { statusCode, body } = response;
    const { error, message, data }: IResponse = body;

    expect(message).toBe(EMessages.ERR_BAD_REQUEST);
    expect(error).toBe(true);
    expect(statusCode).toBe(401);
    expect(data).toBe(null);
  });

  it('should error if confirmPassword data not exists', async () => {
    const reqBody: IRegister = { ...mockUser, confirmPassword: '' };

    const response = await request(app)
      .post(endpoints.AUTH_REGISTER)
      .send(reqBody);

    const { statusCode, body } = response;
    const { error, message, data }: IResponse = body;

    expect(message).toBe(EMessages.ERR_BAD_REQUEST);
    expect(error).toBe(true);
    expect(statusCode).toBe(401);
    expect(data).toBe(null);
  });

  it('should error if farm data length is invalid', async () => {
    const reqBody: IRegister = { ...mockUser, farm: 'a' };

    const response = await request(app)
      .post(endpoints.AUTH_REGISTER)
      .send(reqBody);

    const { statusCode, body } = response;
    const { error, message, data }: IResponse = body;

    expect(message).toBe(EMessages.ERR_BAD_DATA);
    expect(error).toBe(true);
    expect(statusCode).toBe(401);
    expect(data).toBe(null);
  });

  it('should error if farm name length is invalid', async () => {
    const reqBody: IRegister = { ...mockUser, name: 'a' };

    const response = await request(app)
      .post(endpoints.AUTH_REGISTER)
      .send(reqBody);

    const { statusCode, body } = response;
    const { error, message, data }: IResponse = body;

    expect(message).toBe(EMessages.ERR_BAD_DATA);
    expect(error).toBe(true);
    expect(statusCode).toBe(401);
    expect(data).toBe(null);
  });

  it('should error if farm password length is invalid', async () => {
    const reqBody: IRegister = { ...mockUser, password: 'a' };

    const response = await request(app)
      .post(endpoints.AUTH_REGISTER)
      .send(reqBody);

    const { statusCode, body } = response;
    const { error, message, data }: IResponse = body;

    expect(message).toBe(EMessages.ERR_BAD_DATA);
    expect(error).toBe(true);
    expect(statusCode).toBe(401);
    expect(data).toBe(null);
  });

  it('should error if email data is invalid', async () => {
    const reqBody: IRegister = { ...mockUser, email: 'a' };

    const response = await request(app)
      .post(endpoints.AUTH_REGISTER)
      .send(reqBody);

    const { statusCode, body } = response;
    const { error, message, data }: IResponse = body;

    expect(message).toBe(EMessages.ERR_BAD_DATA);
    expect(error).toBe(true);
    expect(statusCode).toBe(401);
    expect(data).toBe(null);
  });

  it('should error if password and confirmPassword not match', async () => {
    const reqBody: IRegister = { ...mockUser, confirmPassword: 'a' };

    const response = await request(app)
      .post(endpoints.AUTH_REGISTER)
      .send(reqBody);

    const { statusCode, body } = response;
    const { error, message, data }: IResponse = body;

    expect(message).toBe(EMessages.ERR_BAD_DATA);
    expect(error).toBe(true);
    expect(statusCode).toBe(401);
    expect(data).toBe(null);
  });

  // TODO: Fix test
  it('should error if user already exist', async () => {
    const reqBody: IRegister = mockUser;

    // already registered
    await AuthHelper.registerUser(app, reqBody);

    // re register
    const response = await AuthHelper.registerUser(app, reqBody);

    const { statusCode, body } = response;
    const { error, message, data } = body;

    expect(message).toBe(EMessages.ERR_USER_EXIST);
    expect(statusCode).toBe(401);
    expect(error).toBeTruthy();
    expect(data).toBe(null);
  });

  it('should success if user first time register', async () => {
    const reqBody: IRegister = mockUser;

    const response = await AuthHelper.registerUser(app, reqBody);

    const { statusCode, body } = response;
    const { error, message, data } = body;

    expect(message).toBe(EMessages.OK_REGISTER);
    expect(statusCode).toBe(201);
    expect(error).toBeFalsy();

    const expectData: IPublicUserData = {
      uid: data.uid,
      farm: mockUser.farm,
      name: mockUser.name,
      email: mockUser.email,
    };

    expect(data).toStrictEqual(expectData);
  });
});
