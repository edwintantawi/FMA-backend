export interface ILogin {
  email: string;
  password: string;
}

export interface IUser extends ILogin {
  farm: string;
  name: string;
}

export interface IRegister extends IUser, ILogin {
  confirmPassword: string;
}

export interface IResponse {
  error: boolean;
  message: string;
  data: any;
}

export interface IPublicUserData extends Omit<IUser, 'password'> {
  uid: string;
}
