import { Bcrypt } from '../../src/utils';
import { mockUser } from '../helpers';

describe('Test Bcrypt method', () => {
  it('should generate salt [genSalt()]', () => {
    const salt = Bcrypt.genSalt(10);
    expect(salt).toBeTruthy();
  });

  it('should hash the password [encryptPassword()]', () => {
    const unsecurePassword = mockUser.password;
    const encryptedPassword = Bcrypt.encryptPassword(unsecurePassword);
    expect(encryptedPassword).not.toBe(unsecurePassword);
  });

  it('should return false if compare not match [comparePassword()]', () => {
    const encryptedPassword = Bcrypt.encryptPassword(mockUser.password);
    const passwordToCompare = 'notmatchpassword';
    const result = Bcrypt.comparePassword(passwordToCompare, encryptedPassword);

    expect(result).toBeFalsy();
  });

  it('should return true if compare is match [comparePassword()]', () => {
    const encryptedPassword = Bcrypt.encryptPassword(mockUser.password);
    const passwordToCompare = mockUser.password;
    const result = Bcrypt.comparePassword(passwordToCompare, encryptedPassword);

    expect(result).toBeTruthy();
  });
});
