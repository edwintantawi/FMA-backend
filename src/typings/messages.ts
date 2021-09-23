export enum EMessages {
  ERR_BAD_REQUEST = 'Bad Request, some require data not found',
  ERR_BAD_DATA = 'Bad Data, some data is invalid',
  ERR_USER_ALREADY_EXIST = 'User already exist, please login',
  ERR_SERVER = 'Server Error',
  ERR_LOGIN_USER_NOT_FOUND = 'Login fail, User not exist',
  ERR_LOGIN_WRONG_PASSWORD = 'Login fail, Password not match',
  ERR_AUTH_TOKEN_NOT_FOUND = 'Auth fail, Require token not found',
  ERR_AUTH_TOKEN = 'Auth fail, Invalid token not found',
  ERR_AUTH_USER = 'Auth fail, User not found',
  OK_REGISTER = 'Register success',
  OK_LOGIN = 'Login success',
}
