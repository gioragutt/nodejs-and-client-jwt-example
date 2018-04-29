import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import * as authActions from './auth.actions';
import { AuthService } from '../auth.service';
import { AuthData } from './auth.models';

@Injectable()
export class AuthEffects {
  @Effect()
  login$ = this.actions$.ofType(authActions.Login.TYPE).pipe(
    switchMap(({payload: {username, password}}: authActions.Login) => this.auth.login(username, password)),
    map((res: AuthData) => new authActions.LoginSuccess(res)),
    catchError(error => of(new authActions.LoginFailure(error)))
  )

  constructor(
    private actions$: Actions,
    private auth: AuthService,
  ) {}
}
