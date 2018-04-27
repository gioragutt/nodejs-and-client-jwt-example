import { Component } from '@angular/core';
import { LobbiesService } from '@core/lobbies';

@Component({
  selector: 'app-lobbies',
  templateUrl: './lobbies.component.html',
  styleUrls: ['./lobbies.component.scss']
})
export class LobbiesComponent {
  lobbyName = '';

  constructor(public lobbies: LobbiesService) {
  }

  createLobby() {
    this.lobbies.create(this.lobbyName)
    this.lobbyName = ''
  }

}
