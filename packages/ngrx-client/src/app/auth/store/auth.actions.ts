import { Action } from '@ngrx/store';
import { AuthData } from './auth.models';

export class Login implements Action {
  static TYPE = '[Auth] Login';
  type = Login.TYPE;
  constructor(public payload: {username: string, password: string}) {}
}

export class LoginSuccess implements Action {
  static TYPE = `${Login.TYPE} Success`;
  type = LoginSuccess.TYPE;
  constructor(public payload: AuthData) {}
}

export class LoginFailure implements Action {
  static TYPE = `${Login.TYPE} Failure`;
  type = LoginFailure.TYPE;
  constructor(public payload: any) {}
}

export type LoginActions = Login | LoginSuccess | LoginFailure;