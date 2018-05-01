import { Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Lobby, selectSelectedLobby, AddEvent } from '../store';
import { Store } from '@ngrx/store';
import { tap, map } from 'rxjs/operators';
import { selectAuthData } from '@app/auth';
import { EmitWebsocketMessage } from '@app/websocket';

@Component({
  selector: 'app-presentational-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationalLobbyComponent {
  @Input() lobby: Lobby;
  @Input() username: string;
  @Output() join = new EventEmitter<string>();
  @Output() leave = new EventEmitter<string>();

  get inLobby(): boolean {
    return this.lobby.users.includes(this.username);
  }

  get users(): string {
    return this.lobby.users.join();
  }
}

@Component({
  selector: 'app-lobby',
  template: `
    <app-presentational-lobby
      *ngIf="lobby$ | async as lobby"
      [lobby]="lobby"
      [username]="username$ | async"
      (join)="onJoin($event)"
      (leave)="onLeave($event)"
    ></app-presentational-lobby>
  `
})
export class LobbyComponent {
  lobby$ = this.store.select(selectSelectedLobby);
  username$ = this.store.select(selectAuthData).pipe(map(data => data && data.profile.username));

  constructor(private store: Store<any>) { }

  onJoin(id: string): void {
    this.store.dispatch(new EmitWebsocketMessage('join_lobby', {id}))
  }

  onLeave(id: string): void {
    this.store.dispatch(new EmitWebsocketMessage('leave_lobby', {id}))
  }
}

