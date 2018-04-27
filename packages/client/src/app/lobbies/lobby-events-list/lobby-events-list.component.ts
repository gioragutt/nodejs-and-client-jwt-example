import { Component, Input } from '@angular/core';
import { Lobby } from '@core/lobbies';

@Component({
  selector: 'app-lobby-events-list',
  templateUrl: './lobby-events-list.component.html',
  styleUrls: ['./lobby-events-list.component.scss']
})
export class LobbyEventsListComponent {
  @Input() lobby: Lobby;
}
