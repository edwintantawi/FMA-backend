import { Application } from 'express';
import request from 'supertest';
import { endpoints } from '.';
import { IRegister } from '../../src/typings';

export class AuthHelper {
  static async registerUser(
    app: Application,
    reqBody: IRegister
  ): Promise<request.Response> {
    const response = await request(app)
      .post(endpoints.AUTH_REGISTER)
      .send(reqBody);

    return response;
  }
}
