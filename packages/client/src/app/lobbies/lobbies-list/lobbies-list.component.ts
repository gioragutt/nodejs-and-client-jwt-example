import { Component, OnInit, Input } from '@angular/core';
import { Lobby } from '../store';
import { Store } from '@ngrx/store';
import { EmitWebsocketMessage } from '@app/websocket';

@Component({
  selector: 'app-lobbies-list',
  templateUrl: './lobbies-list.component.html',
  styleUrls: ['./lobbies-list.component.scss'],
})
export class LobbiesListComponent {
  @Input() lobbies: Lobby[];

  constructor(private store: Store<any>) {}

  createLobby(name: string) {
    this.store.dispatch(new EmitWebsocketMessage('create_lobby', { name }));
  }
}
