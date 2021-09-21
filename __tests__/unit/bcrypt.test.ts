import { Bcrypt } from '../../src/helpers';
import { mockUser } from '../helpers';

describe('Test Bcrypt method', () => {
  it('should generate salt', () => {
    const salt = Bcrypt.genSalt(10);
    expect(salt).toBeTruthy();
  });

  it('should hash the password', () => {
    const unsecurePassword = mockUser.password;
    const securePassword = Bcrypt.hashPassword(unsecurePassword);
    expect(securePassword).not.toBe(unsecurePassword);
  });
});
