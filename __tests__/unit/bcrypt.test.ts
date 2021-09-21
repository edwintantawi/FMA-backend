import { Bcrypt } from '../../src/helpers';
import { mockUser } from '../helpers';

describe('Test Bcrypt method', () => {
  it('should generate salt', () => {
    const salt = Bcrypt.genSalt(10);
    expect(salt).toBeTruthy();
  });

  it('should hash the password', () => {
    const unsecurePassword = mockUser.password;
    const encryptedPassword = Bcrypt.encryptPassword(unsecurePassword);
    expect(encryptedPassword).not.toBe(unsecurePassword);
  });

  it('should return false if compare not match', () => {
    const encryptedPassword = Bcrypt.encryptPassword(mockUser.password);
    const passwordToCompare = 'notmatchpassword';
    const result = Bcrypt.comparePassword(passwordToCompare, encryptedPassword);

    expect(result).toBeFalsy();
  });

  it('should return true if compare is match', () => {
    const encryptedPassword = Bcrypt.encryptPassword(mockUser.password);
    const passwordToCompare = mockUser.password;
    const result = Bcrypt.comparePassword(passwordToCompare, encryptedPassword);

    expect(result).toBeTruthy();
  });
});
