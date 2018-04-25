import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { WebsocketService } from '@core/websocket.service';
import { environment } from '@env/environment';
import { filter } from 'rxjs/operators/filter';
import { switchMap } from 'rxjs/operators/switchMap';
import { tap } from 'rxjs/operators/tap';
import { uniqBy, sortBy } from 'lodash';
import { pipe } from '@app/utils';
import { map } from 'rxjs/operators/map';

const uniqAndSortLobbies = pipe(
  lobbies => uniqBy(lobbies, ({id}) => id),
  lobbies => sortBy(lobbies, ({id}) => id)
)

export interface Lobby {
  id: string;
  users: string[];
}

@Injectable()
export class LobbiesService {

  private lobbies = new BehaviorSubject<Lobby[]>([]);

  public get lobbies$(): Observable<Lobby[]> {
    return this.lobbies.asObservable();
  }
  
  constructor(private socket: WebsocketService, http: HttpClient) {
    this.socket.on<Lobby>('new_lobby_created').subscribe(this.addLobby);

    this.socket.statusChanged$.pipe(
      filter(connected => connected),
      switchMap(() => http.get<Lobby[]>(`${environment.apiBaseUrl}/lobbies`)),
      map(lobbies => uniqAndSortLobbies(lobbies)),
      tap(lobbies => console.log('fetched lobbies', {lobbies})),
    ).subscribe(lobbies => this.lobbies.next(lobbies));      
  }

  private addLobby = (lobby: Lobby) => {
    const addToLobbies = pipe(
      lobby => [lobby, ...this.lobbies.getValue()],
      uniqAndSortLobbies,
    )
    this.lobbies.next(addToLobbies(lobby));
  }

  create(name: string): void {
    this.socket.emit('create_lobby', name);
  }

  join(name: string): void {
    this.socket.emit('join_lobby', name, (lobby: Lobby) => {
      this.addLobby(lobby)
    })
  }

  leave(name: string): void {
    this.socket.emit('leave_lobby', name, (lobby: Lobby) => {
      this.addLobby(lobby)
    })
  }
}
