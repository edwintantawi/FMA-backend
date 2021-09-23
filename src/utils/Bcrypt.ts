import bcrypt from 'bcrypt';
import { CONFIG } from '../config';

export class Bcrypt {
  static genSalt(rounds: number): string {
    const salt = bcrypt.genSaltSync(rounds);
    return salt;
  }

  static encryptPassword(password: string): string {
    const salt = this.genSalt(CONFIG.bcryptSaltSize);
    const hashed = bcrypt.hashSync(password, salt);
    return hashed;
  }

  static comparePassword(password: string, encryptedPassword: string): boolean {
    const isMatch = bcrypt.compareSync(password, encryptedPassword);
    return isMatch;
  }
}
