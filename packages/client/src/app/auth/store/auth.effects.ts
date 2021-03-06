import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { RouterNavigationAction } from '@ngrx/router-store';
import { switchMap, map, catchError, tap, filter } from 'rxjs/operators';
import { of ,  Observable } from 'rxjs';

import * as authActions from './auth.actions';

import { AuthService } from '../auth.service';
import { AuthData } from './auth.models';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  @Effect()
  login$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.Login),
    switchMap(({ username, password }: authActions.Login) => this.auth.login(username, password)),
    map((res: AuthData) => new authActions.LoginSuccess(res)),
    catchError(error => of(new authActions.LoginFailure(error))),
  );

  @Effect({dispatch: false})
  redirectAfterLogin$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.LoginSuccess),
    tap(() => this.router.navigate(['/lobbies'])),
  );

  @Effect({dispatch: false})
  redirectAfterLogout$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.Logout),
    tap(() => this.router.navigate(['/login'])),
  );

  // @Effect({ dispatch: false })
  // logger$ = this.actions$.pipe(
  //   tap(action => console.log('got action', action))
  // )

  constructor(
    private actions$: Actions,
    private auth: AuthService,
    private router: Router,
  ) { }
}
