import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { WebsocketService } from '../websocket.service';
import { WebsocketActionTypes, EmitWebsocketMessage } from './websocket.actions'

@Injectable()
export class WebsocketEffects {
  @Effect({dispatch: false})
  emit$ = this.actions$.pipe(
    ofType(WebsocketActionTypes.EmitWebsocketMessage),
    tap(({event, args}: EmitWebsocketMessage) => {
      this.websocket.emit(event, ...args);
    }),
  )

  constructor(
    private actions$: Actions,
    private websocket: WebsocketService,
  ) {}
}
