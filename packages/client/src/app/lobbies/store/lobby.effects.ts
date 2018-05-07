import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  switchMap,
  map,
  catchError,
  retryWhen,
  delay,
  take,
  distinctUntilChanged,
  filter,
  withLatestFrom,
  tap,
} from 'rxjs/operators';
import { merge ,  of } from 'rxjs';

import * as fromWebsocket from '@app/websocket';
import * as fromLobby from './lobby.actions';
import { selectLobbyIdFromParams, selectRoutedLobby } from './lobby.reducer';

import { LobbiesService } from '../lobbies.service';
import {
  Lobby,
  JoinLobbyEvent,
  LeaveLobbyEvent,
  MessageLobbyEvent,
  LobbyEvent,
} from './lobby.model';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Injectable()
export class LobbyEffects {
  @Effect()
  fetchAll$ = this.actions$.pipe(
    ofType(fromLobby.LobbyActionTypes.FetchLobbies),
    switchMap(() => this.lobbies.fetchAll()),
    map(lobbies => new fromLobby.LoadLobbies({ lobbies })),
    retryWhen(errors => errors.pipe(delay(1000), take(5))),
  );

  @Effect({ dispatch: false })
  routeToLobbiesWhenSelectedLobbyDeleted = this.actions$.pipe(
    ofType(fromLobby.LobbyActionTypes.DeleteLobby),
    withLatestFrom(this.store.select(selectLobbyIdFromParams)),
    filter(([action, lobbyId]: [fromLobby.DeleteLobby, string]) => action.payload.id === lobbyId),
    tap(() => this.router.navigate(['/lobbies'])),
  );

  @Effect()
  fetchOnWebsocketReconnection$ = this.actions$.pipe(
    ofType(fromWebsocket.WebsocketActionTypes.Connected),
    map(() => new fromLobby.FetchLobbies()),
  );

  constructor(
    private actions$: Actions,
    private lobbies: LobbiesService,
    private websocket: fromWebsocket.WebsocketService,
    private router: Router,
    private store: Store<any>,
  ) {

    this.store.select(selectRoutedLobby)
      .pipe(filter(lobby => !lobby))
      .subscribe(() => this.router.navigate(['/lobbies']));

    this.websocket.on<Lobby>('lobby_created').subscribe(lobby => {
      this.store.dispatch(new fromLobby.AddLobby({ lobby }));
    });

    this.websocket.on<string>('lobby_deleted').subscribe(id => {
      this.store.dispatch(new fromLobby.DeleteLobby({ id }));
    });

    merge(
      this.websocket.on<JoinLobbyEvent>('user_joined_lobby'),
      this.websocket.on<LeaveLobbyEvent>('user_left_lobby'),
      this.websocket.on<MessageLobbyEvent>('message_to_lobby'),
    ).subscribe((event: LobbyEvent) => {
      this.store.dispatch(new fromLobby.AddEvent({ event }));
    });
  }
}
