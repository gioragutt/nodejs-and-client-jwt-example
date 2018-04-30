import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, retryWhen, delay, take } from 'rxjs/operators';

import * as fromLobby from './lobby.actions'
import { LobbiesService } from '../lobbies.service';

@Injectable()
export class LobbyEffects {

  @Effect()
  fetchAll$ = this.actions$.pipe(
    ofType(fromLobby.LobbyActionTypes.FetchLobbies),
    switchMap(() => this.lobbies.fetchAll()),
    map(lobbies => new fromLobby.LoadLobbies({lobbies})),
    retryWhen(errors => errors.pipe(delay(1000), take(5)))
  )

  constructor(
    private actions$: Actions,
    private lobbies: LobbiesService,
  ) { }
}
