import { Action } from '@ngrx/store';
import { type } from '../utils/type.util';
import { Auth, Err, User } from '../domain';


/**
 * 分为以下七个状态
 * 登录请求/登录请求成功/登录请求失败
 * 注册请求/注册请求成功/注册请求失败
 * 退出
 */
export const ActionTypes = {
  LOGIN: type('[Auth] Login'),
  LOGIN_SUCCESS: type('[Auth] Login Success'),
  LOGIN_FAIL: type('[Auth] Login Fail'),
  REGISTER: type('[Auth] Register'),
  REGISTER_SUCCESS: type('[Auth] Register Success'),
  REGISTER_FAIL: type('[Auth] Register Fail'),
  LOGOUT: type('[Auth] Logout')
};

// 登录请求
export class LoginAction implements Action {
  type = ActionTypes.LOGIN;

  // 登录的时候携带的数据为用户名和密码
  constructor(public payload: { email: string, password: string }) {
  }
}

// 登录请求成功
export class LoginSuccessAction implements Action {
  type = ActionTypes.LOGIN_SUCCESS;

  constructor(public payload: Auth) {
  }
}

// 登录请求失败
export class LoginFailAction implements Action {
  type = ActionTypes.LOGIN_FAIL;

  constructor(public payload: Err) {
  }
}

// 注册请求
export class RegisterAction implements Action {
  type = ActionTypes.REGISTER;

  // 注册的时候携带的数据为 User 类型
  constructor(public payload: User) {
  }
}

// 注册请求成功
export class RegisterSuccessAction implements Action {
  type = ActionTypes.REGISTER_SUCCESS;

  constructor(public payload: Auth) {
  }
}

// 注册请求失败
export class RegisterFailAction implements Action {
  type = ActionTypes.REGISTER_FAIL;

  constructor(public payload: Err) {
  }
}

// 退出
export class LogoutAction implements Action {
  type = ActionTypes.LOGOUT;

  constructor(public payload: Auth) {
  }
}

export type Actions
  = LoginAction
  | LoginSuccessAction
  | LoginFailAction
  | RegisterAction
  | RegisterSuccessAction
  | RegisterFailAction
  | LogoutAction;
