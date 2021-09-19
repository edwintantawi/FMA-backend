import request from 'supertest';
import { app } from '../appSetup';
import { endpoints } from '../helpers';

describe('Test home endpoint [GET | /]', () => {
  it('should render HTML page successful', async () => {
    const response = await request(app).get(endpoints.HOME);

    const { statusCode, headers } = response;

    expect(statusCode).toBe(200);
    expect(headers['content-type']).toBe('text/html; charset=utf-8');
  });
});
