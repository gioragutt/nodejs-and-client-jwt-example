import { Component, OnInit } from '@angular/core';
import { LobbiesService } from '@core/lobbies.service';
import { AuthService } from '@core/auth.service';

@Component({
  selector: 'app-lobbies-list',
  templateUrl: './lobbies-list.component.html',
  styleUrls: ['./lobbies-list.component.scss']
})
export class LobbiesListComponent {
  get username(): string {
    return this.auth.currentProfile.username;
  }

  constructor(public lobbies: LobbiesService, private auth: AuthService) { }

  joinOrLeave(lobby: string, action: 'join' | 'leave') {
    if (action === 'join') {
      this.lobbies.join(lobby);
    } else if (action === 'leave') {
      this.lobbies.leave(lobby);
    }
  }
}
