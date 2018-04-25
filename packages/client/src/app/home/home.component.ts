import { Component } from '@angular/core';
import { LobbiesService } from '@core/lobbies.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  lobbyName = '';

  constructor(public lobbies: LobbiesService) {
  }

  createLobby() {
    this.lobbies.create(this.lobbyName)
    this.lobbyName = ''
  }

}
