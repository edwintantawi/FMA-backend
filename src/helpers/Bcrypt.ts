import bcrypt from 'bcrypt';
import { ENV } from '../config';

export class Bcrypt {
  static genSalt(rounds: number): string {
    const salt = bcrypt.genSaltSync(rounds);
    return salt;
  }

  static encryptPassword(password: string): string {
    const salt = this.genSalt(ENV.bcryptSaltSize);
    const hashed = bcrypt.hashSync(password, salt);
    return hashed;
  }

  static comparePassword(password: string, encryptedPassword: string): boolean {
    const isMatch = bcrypt.compareSync(password, encryptedPassword);
    return isMatch;
  }
}
