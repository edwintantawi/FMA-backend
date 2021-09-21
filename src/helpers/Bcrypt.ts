import bcrypt from 'bcrypt';
import { ENV } from '../config';

export class Bcrypt {
  static genSalt(rounds: number) {
    const salt = bcrypt.genSaltSync(rounds);
    return salt;
  }

  static hashPassword(password: string) {
    const salt = this.genSalt(ENV.bcryptSaltSize);
    const hashed = bcrypt.hashSync(password, salt);
    return hashed;
  }
}
