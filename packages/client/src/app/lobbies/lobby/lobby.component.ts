import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Lobby, selectSelectedLobby, AddEvent, LobbyEvent } from '../store';
import { Store } from '@ngrx/store';
import { tap, map } from 'rxjs/operators';
import { selectAuthData } from '@app/auth';
import { EmitWebsocketMessage } from '@app/websocket';

interface MessageEvent {
  id: string;
  message: string;
}

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
  @Output() delete = new EventEmitter<string>();
  @Output() message = new EventEmitter<MessageEvent>();

  scrolledEvents: LobbyEvent[];

  get inLobby(): boolean {
    return this.lobby.users.includes(this.username);
  }

  get isOwner(): boolean {
    return this.lobby.owner === this.username;
  }

  get users(): string {
    return this.lobby.users.join(', ');
  }

  sendMessage(message: string): void {
    this.message.emit({ id: this.lobby.id, message });
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
      (delete)="onDelete($event)"
      (message)="onMessage($event)"
    ></app-presentational-lobby>
  `,
})
export class LobbyComponent {
  lobby$ = this.store.select(selectSelectedLobby);
  username$ = this.store.select(selectAuthData).pipe(map(data => data && data.profile.username));

  constructor(private store: Store<any>) {}

  onJoin(id: string): void {
    this.store.dispatch(new EmitWebsocketMessage('join_lobby', { id }));
  }

  onLeave(id: string): void {
    this.store.dispatch(new EmitWebsocketMessage('leave_lobby', { id }));
  }

  onDelete(id: string): void {
    this.store.dispatch(new EmitWebsocketMessage('delete_lobby', { id }));
  }

  onMessage(event: MessageEvent) {
    this.store.dispatch(new EmitWebsocketMessage('message_to_lobby', event));
  }
}
