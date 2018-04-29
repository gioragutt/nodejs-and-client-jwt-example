import { Action } from '@ngrx/store';
import { AuthData } from '../models/auth.models';

export class Login implements Action {
  static TYPE = '[Auth] login';
  type = Login.TYPE;
  constructor(public payload: {username: string, password: string}) {}
}

export class LoginSuccess implements Action {
  static TYPE = `${Login.TYPE} success`;
  type = LoginSuccess.TYPE;
  constructor(public payload: AuthData) {}
}

export class LoginFailure implements Action {
  static TYPE = `${Login.TYPE} failure`;
  type = LoginFailure.TYPE;
  constructor(public payload: any) {}
}

export type LoginActions = Login | LoginSuccess | LoginFailure;