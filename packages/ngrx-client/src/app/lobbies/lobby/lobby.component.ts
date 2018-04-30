import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Lobby, selectSelectedLobby } from '../store';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-presentational-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class PresentationalLobbyComponent {
  @Input() lobby: Lobby;
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
  }
}
