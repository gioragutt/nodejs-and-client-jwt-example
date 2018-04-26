import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tap, switchMap, filter, map } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';

import { WebsocketService } from '@core/websocket.service';
import { environment } from '@env/environment';
import { uniqBy, sortBy } from 'lodash';
import { pipe } from '@app/utils';

const uniqAndSortLobbies = pipe(
  lobbies => uniqBy(lobbies, ({id}) => id),
  lobbies => sortBy(lobbies, ({id}) => id)
)

export interface Lobby {
  id: string;
  users: string[];
}

export interface UserJoinedOrLeftLobby {
  lobby: Lobby;
  username: string;
}

export interface MessageToLobby {
  lobby: string;
  username: string;
  message: string;
}

@Injectable()
export class LobbiesService {

  private lobbies = new BehaviorSubject<Lobby[]>([]);

  public get lobbies$(): Observable<Lobby[]> {
    return this.lobbies.asObservable();
  }
  
  constructor(private socket: WebsocketService, private http: HttpClient) {
    this.socket.on<MessageToLobby>('message_to_lobby').subscribe(msg => console.log('message_to_lobby', msg))
    this.subscribeToLobbyChanges();
    this.fetchLobbiesOnReconnection();
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
    ).subscribe(lobbies => this.lobbies.next(lobbies));      
  }

  private addLobby = (lobby: Lobby) => {
    const addToLobbies = pipe(
      lobby => [lobby, ...this.lobbies.getValue()],
      uniqAndSortLobbies,
    );
    this.lobbies.next(addToLobbies(lobby));
  }
}
