import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap, filter, map } from 'rxjs/operators';
import { WebsocketService } from '../websocket.service';
import { WebsocketActionTypes, EmitWebsocketMessage, Error } from './websocket.actions';
import { Logout } from '@app/auth';

@Injectable()
export class WebsocketEffects {
  @Effect({dispatch: false})
  emit$ = this.actions$.pipe(
    ofType(WebsocketActionTypes.EmitWebsocketMessage),
    tap(({event, args}: EmitWebsocketMessage) => {
      this.websocket.emit(event, ...args);
    }),
  );

 @Effect()
  logoutOnJwtTokenExpiration$ = this.actions$.pipe(
    ofType(WebsocketActionTypes.Error),
    filter(({ error: { code } }: Error) => code === 'invalid_token'),
    map(() => new Logout()),
  );

  constructor(
    private actions$: Actions,
    private websocket: WebsocketService,
  ) {}
}
