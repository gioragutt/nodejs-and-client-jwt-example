import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Lobby, selectRoutedLobby, AddEvent, LobbyEvent } from '../store';
import { Store } from '@ngrx/store';
import { tap, map, filter } from 'rxjs/operators';
import { selectAuthData } from '@app/auth';
import { EmitWebsocketMessage } from '@app/websocket';
import { VirtualScrollComponent } from 'angular2-virtual-scroll';
import { last } from 'lodash';

import * as utils from '../utils';

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
  @Output() scrollToBottomOnChange = new EventEmitter<boolean>();

  _shouldScrollToBottom = false;
  set shouldScrollToBottom(value: boolean) {
    this._shouldScrollToBottom = value;
    this.scrollToBottomOnChange.emit(value);
  }
  get shouldScrollToBottom(): boolean {
    return this._shouldScrollToBottom;
  }

  scrolledEvents: LobbyEvent[];

  @ViewChild(VirtualScrollComponent) private virtualScroll: VirtualScrollComponent;

  get inLobby(): boolean {
    return utils.isInLobby(this.lobby, this.username);
  }

  get isOwner(): boolean {
    return utils.isOwner(this.lobby, this.username);
  }

  get users(): string {
    return this.lobby.users.join(', ');
  }

  sendMessage(message: string): void {
    this.message.emit({ id: this.lobby.id, message });
  }

  public scrollToBottom(): void {
    this.virtualScroll.scrollInto(last(this.lobby.events));
  }
}

@Component({
  selector: 'app-lobby',
  template: `
    <app-presentational-lobby
      #theLobby
      *ngIf="lobby$ | async as lobby"
      [lobby]="lobby"
      [username]="username$ | async"
      (join)="onJoin($event)"
      (leave)="onLeave($event)"
      (delete)="onDelete($event)"
      (message)="onMessage($event)"
      (scrollToBottomOnChange)="onScrollToBottomOnChange($event)"
    ></app-presentational-lobby>
  `,
})
export class LobbyComponent implements OnInit {
  lobby$ = this.store.select(selectRoutedLobby).pipe(filter(lobby => !!lobby));
  username$ = this.store.select(selectAuthData).pipe(map(data => data && data.profile.username));
  scrollToBottomOnChange = true;

  @ViewChild('theLobby') private lobby: PresentationalLobbyComponent;

  constructor(private store: Store<any>) {}

  ngOnInit(): void {
    this.lobby$.pipe(map(lobby => lobby.events.length)).subscribe(() => this.scrollToBottom());
  }

  scrollToBottom(): void {
    if (this.lobby && this.scrollToBottomOnChange) {
      this.lobby.scrollToBottom();
    }
  }

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

  onScrollToBottomOnChange(change: boolean): void {
    this.scrollToBottomOnChange = change;
    if (this.scrollToBottomOnChange) {
      this.scrollToBottom();
    }
  }
}
