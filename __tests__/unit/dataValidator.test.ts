import { DataValidator } from '../../src/helpers';

describe('Test DataValidator helper', () => {
  describe('Test validateLength method', () => {
    it('should return false if data is empty', () => {
      const data = ''; // 1
      const result = DataValidator.validateLength(data);
      expect(result).toBeFalsy();
    });

    it('should return false if length is less then 2', () => {
      const data = 'a'; // 1
      const result = DataValidator.validateLength(data, { minLength: 2 });
      expect(result).toBeFalsy();
    });

    it('should return false if length is more then 15', () => {
      const data = 'abcdefghijklmnop'; // 16
      const result = DataValidator.validateLength(data, { maxLength: 15 });
      expect(result).toBeFalsy();
    });

    it('should return true if length is no more and no less then', () => {
      const data = 'abcdefghijklmno'; // 15
      const result = DataValidator.validateLength(data, {
        maxLength: 15,
        minLength: 2,
      });
      expect(result).toBeTruthy();
    });
  });

  describe('Test validateEmail method', () => {
    it('should return false if email is empty', () => {
      const email = '';
      const result = DataValidator.validateEmail(email);
      expect(result).toBeFalsy();
    });

    it('should return false if email length more then 254', () => {
      const emailAccount = 'a'.repeat(255);
      const email = `${emailAccount}@example.com`;
      const result = DataValidator.validateEmail(email);
      expect(result).toBeFalsy();
    });

    it('should return false if email account length more then 64', () => {
      const emailAccount = 'a'.repeat(65);
      const email = `${emailAccount}@example.com`;
      const result = DataValidator.validateEmail(email);
      expect(result).toBeFalsy();
    });

    it('should return false if email address length more then 255', () => {
      const emailAddess = 'b'.repeat(256);
      const email = `aaa@${emailAddess}.com`;
      const result = DataValidator.validateEmail(email);
      expect(result).toBeFalsy();
    });

    it('should return false if email invalid format (multiple @)', () => {
      const email = 'aaa@aa@example.com';
      const result = DataValidator.validateEmail(email);
      expect(result).toBeFalsy();
    });

    it('should return false if email invalid format (contains underscore)', () => {
      const email = 'aaa@bad_example.com';
      const result = DataValidator.validateEmail(email);
      expect(result).toBeFalsy();
    });

    it('should return false if email invalid format (no domain)', () => {
      const email = 'aaa@example';
      const result = DataValidator.validateEmail(email);
      expect(result).toBeFalsy();
    });

    it('should return false if email invalid format (invalid address)', () => {
      const email = 'example.com';
      const result = DataValidator.validateEmail(email);
      expect(result).toBeFalsy();
    });

    it('should return false if email invalid format (contains invalid char)', () => {
      const email = 'a"b(c)d,e:f;g<h>i[jk]l@example.com';
      const result = DataValidator.validateEmail(email);
      expect(result).toBeFalsy();
    });

    it('should return true if email valid format', () => {
      const email = 'aaaaa@example.com';
      const result = DataValidator.validateEmail(email);
      expect(result).toBeTruthy();
    });
  });

  describe('Test compare method', () => {
    it('should return false if not match', () => {
      const leftHand = 'texttocompare';
      const rightHand = 'texttocomparenotmatch';

      const result = DataValidator.compareString(leftHand, rightHand);
      expect(result).toBeFalsy();
    });

    it('should return true if match', () => {
      const leftHand = 'texttocompare';
      const rightHand = 'texttocompare';

      const result = DataValidator.compareString(leftHand, rightHand);
      expect(result).toBeTruthy();
    });
  });
});
