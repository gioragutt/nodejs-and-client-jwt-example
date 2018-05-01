import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Lobby, selectSelectedLobby, AddEvent } from '../store';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-presentational-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class PresentationalLobbyComponent {
  @Input() lobby: Lobby;

  get users(): string {
    return this.lobby.users.join();
  }
}

@Component({
  selector: 'app-lobby',
  template: `
    <app-presentational-lobby
      [lobby]="lobby$ | async"
    ></app-presentational-lobby>
  `
})
export class LobbyComponent {
  lobby$: Observable<Lobby>;
  constructor(private store: Store<any>) {
    this.lobby$ = this.store.select(selectSelectedLobby).pipe(
      tap(lobby => console.log('selected lobby', lobby))
    );

    setTimeout(() => {
      this.store.dispatch(new AddEvent({event: {
        id: '1',
        event: 'join',
        timestamp: Date.now(),
        username: 'LALALA',
      }}))

      setTimeout(() => {
        this.store.dispatch(new AddEvent({event: {
          id: '1',
          event: 'leave',
          timestamp: Date.now(),
          username: 'LALALA',
        }}))
      }, 2000)
    }, 5000)
  }
}
