interface Options {
  maxLength?: number;
  minLength?: number;
}

export class DataValidator {
  static validateLength(data: string, options?: Options): boolean {
    const maxLength = options?.maxLength || 20;
    const minLength = options?.minLength || 2;

    if (!data) return false;
    if (data.length > maxLength) return false;
    if (data.length < minLength) return false;
    return true;
  }

  static validateEmail(email: string): boolean {
    const regex =
      /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    if (!email) return false;
    if (!this.validateLength(email, { maxLength: 254 })) return false;

    const [account, address] = email.split('@');

    if (!this.validateLength(account, { maxLength: 64 })) return false;
    if (!this.validateLength(address, { maxLength: 255 })) return false;

    if (!regex.test(email)) return false;

    return true;
  }

  static compare(leftHand: string, rightHand: string): boolean {
    return leftHand === rightHand;
  }
}
