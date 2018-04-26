import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Lobby, LobbiesService } from '@core/lobbies.service';
import { AuthService } from '@core/auth.service';

@Component({
  selector: 'app-lobby-item',
  templateUrl: './lobby-item.component.html',
  styleUrls: ['./lobby-item.component.scss']
})
export class LobbyItemComponent {
  @Input() lobby: Lobby;
  @Input() username: string;
  @Output() joinOrLeave = new EventEmitter<'join' | 'leave'>();
  messageContent: string;

  get canSendMessage(): boolean {
    return this.messageContent && this.messageContent.trim().length > 0
  }

  get isInLobby(): boolean {
    return this.lobby.users.includes(this.username)
  }

  constructor(private lobbies: LobbiesService, private auth: AuthService) { }

  sendMessage(): void {
    this.lobbies.message(this.lobby.id, this.messageContent)
    this.messageContent = ''
  }

  joinOrLeaveClicked(): void {
    this.joinOrLeave.emit(this.isInLobby ? 'leave' : 'join')
  }
}
