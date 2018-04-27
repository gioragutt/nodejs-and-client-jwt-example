import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tap, switchMap, filter, map } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { uniqBy, sortBy } from 'lodash';

import { Lobby, UserJoinedOrLeftLobby } from './types';
import { pipe } from '@app/utils';
import { environment } from '@env/environment';
import { WebsocketService } from '@core/websocket.service';
import { AuthService } from '@core/auth.service';
import { MessageLobbyEvent } from '@core/lobbies/types';

const uniqAndSortLobbies = pipe(
  lobbies => uniqBy(lobbies, ({id}) => id),
  lobbies => sortBy(lobbies, ({id}) => id)
)

@Injectable()
export class LobbiesService {

  private _lobbies = new BehaviorSubject<Lobby[]>([]);

  public get lobbies$(): Observable<Lobby[]> {
    return this._lobbies.asObservable();
  }
  
  constructor(
    private socket: WebsocketService,
    private http: HttpClient,
    private auth: AuthService,
  ) {  
    this.subscribeToLobbyChanges();
    this.fetchLobbiesOnReconnection();
    this.subscribeToLobbyMessages();
  }

  isInLobby(id: string): boolean {
    return this._lobbies.getValue()
      .find(lobby => lobby.id === id)
        .users.includes(this.auth.currentProfile.username);
  }

  create(id: string): void {
    this.socket.emit('create_lobby', {id});
  }

  join(id: string): void {
    this.socket.emit('join_lobby', {id})
  }

  leave(id: string): void {
    this.socket.emit('leave_lobby', {id})
  }

  message(id: string, message: string): void {
    this.socket.emit('message_to_lobby', {id, message})
  }

  private subscribeToLobbyChanges(): void {
    this.socket.firstConnection$.pipe(
      switchMap(() => merge(
        this.socket.on<UserJoinedOrLeftLobby>('user_joined_lobby')
          .pipe(map(event => event.lobby)),
        this.socket.on<UserJoinedOrLeftLobby>('user_left_lobby')
          .pipe(map(event => event.lobby)),
        this.socket.on<Lobby>('new_lobby_created'),
        this.subscribeToLobbyMessages()
      )),
      tap(lobby => console.log('lobby changed', {lobby})),
    ).subscribe(this.addLobby);
  }

  private fetchLobbiesOnReconnection(): void {
    this.socket.statusChanged$.pipe(
      filter(connected => connected),
      switchMap(() => this.http.get<Lobby[]>(`${environment.apiBaseUrl}/lobbies`)),
      map(lobbies => uniqAndSortLobbies(lobbies)),
      tap(lobbies => console.log('fetched lobbies', {lobbies})),
    ).subscribe(lobbies => this._lobbies.next(lobbies));      
  }

  private subscribeToLobbyMessages(): Observable<Lobby> {
    return this.socket.on<MessageLobbyEvent>('message_to_lobby').pipe(
      map((message: MessageLobbyEvent) => {
        const lobby = this._lobbies.getValue().find(lobby => lobby.id === message.id)
        lobby.events = [...lobby.events, message]
        return lobby;
      })
    )
  }

  private addLobby = (lobby: Lobby) => {
    const addToLobbies = pipe(
      lobby => [lobby, ...this._lobbies.getValue()],
      uniqAndSortLobbies,
    );
    this._lobbies.next(addToLobbies(lobby));
  }
}
