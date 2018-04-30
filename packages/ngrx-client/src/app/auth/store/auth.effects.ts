import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { RouterNavigationAction } from '@ngrx/router-store';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import * as authActions from './auth.actions';
import { AuthService } from '../auth.service';
import { AuthData } from './auth.models';
import { Router } from '@angular/router';
import { NavigateTo } from '@app/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthEffects {
  @Effect()
  login$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.Login),
    switchMap(({payload: {username, password}}: authActions.Login) => this.auth.login(username, password)),
    map((res: AuthData) => new authActions.LoginSuccess(res)),
    catchError(error => of(new authActions.LoginFailure(error)))
  )

  @Effect()
  redirectAfterLogin$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.LoginSuccess),
    map(() => new NavigateTo({to: '/lobbies'}))
  )

  @Effect()
  redirectAfterLogout$ = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.Logout),
    map(() => new NavigateTo({to: '/login'}))
  )

  @Effect({ dispatch: false })
  logger$ = this.actions$.pipe(
    tap(action => console.log('got action', action))
  )

  constructor(
    private actions$: Actions,
    private auth: AuthService,
    private router: Router,
  ) {}
}
