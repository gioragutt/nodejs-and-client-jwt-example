import { Component, Input } from '@angular/core';
import { LobbyEvent, Lobby } from '../store';

@Component({
  selector: 'app-lobby-event',
  templateUrl: './lobby-event.component.html',
  styleUrls: ['./lobby-event.component.scss'],
})
export class LobbyEventComponent {
  static ICONS = {
    create: 'play_arrow',
    join: 'call',
    leave: 'call_end',
    message: 'message',
  };

  @Input() event: LobbyEvent;
  @Input() lobby: Lobby;
  @Input() myUsername: string;

  get isMyMessage(): boolean {
    return this.username === this.myUsername;
  }

  get message(): string {
    switch (this.event.event) {
      case 'create':
        return `created #${this.lobby.name}`;
      case 'join':
        return `joined #${this.lobby.name}`;
      case 'leave':
        return `left #${this.lobby.name}`;
      case 'message':
        return this.event.message;
    }
  }

  get username(): string {
    return this.event.event !== 'create' ? this.event.username : this.event.owner;
  }

  get icon(): string {
    return LobbyEventComponent.ICONS[this.event.event];
  }
}
