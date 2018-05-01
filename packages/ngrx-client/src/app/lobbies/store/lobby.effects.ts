import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, retryWhen, delay, take } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';

import { WebsocketService } from '@app/websocket';

import * as fromLobby from './lobby.actions'
import { LobbiesService } from '../lobbies.service';
import { Lobby, JoinLobbyEvent, LeaveLobbyEvent, MessageLobbyEvent, LobbyEvent } from './lobby.model';
import { Store } from '@ngrx/store';

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
    private websocket: WebsocketService,
    private store: Store<any>,
  ) {
    this.websocket.on<Lobby>('new_lobby_created').subscribe(lobby => {
      this.store.dispatch(new fromLobby.AddLobby({lobby}));
    })

    merge(
      this.websocket.on<JoinLobbyEvent>('user_joined_lobby'),
      this.websocket.on<LeaveLobbyEvent>('user_left_lobby'),
      this.websocket.on<MessageLobbyEvent>('message_to_lobby'),
    ).subscribe((event: LobbyEvent) => {
      this.store.dispatch(new fromLobby.AddEvent({event}));
    })
  }
}
