import { Component, Input, OnInit } from '@angular/core';
import { Lobby, LobbiesService } from '@core/lobbies';
import { AuthService } from '@core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { map, tap, filter, withLatestFrom, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-lobby-item',
  templateUrl: './lobby-item.component.html',
  styleUrls: ['./lobby-item.component.scss']
})
export class LobbyItemComponent implements OnInit {
  @Input() lobby: Lobby;
  @Input() username: string;
  messageContent: string;

  get canSendMessage(): boolean {
    return this.messageContent && this.messageContent.trim().length > 0
  }

  get isInLobby(): boolean {
    return this.lobby.users.includes(this.username)
  }

  constructor(
    private lobbies: LobbiesService,
    private auth: AuthService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.auth.profile$.pipe(
      filter(profile => !!profile),
      map(profile => profile.username),
    ).subscribe(username => this.username = username)

    this.route.params.pipe(
      map(params => params.id),
      switchMap(id => this.lobbies.lobbies$.pipe(
        map(lobbies => lobbies.find(lobby => lobby.id === id))
      )),
      filter(lobby => !!lobby)
    ).subscribe(lobby => this.lobby = lobby);
  }

  sendMessage(): void {
    this.lobbies.message(this.lobby.id, this.messageContent)
    this.messageContent = ''
  }

  joinOrLeaveClicked(): void {
    if (this.isInLobby) {
      this.lobbies.leave(this.lobby.id)
    } else {
      this.lobbies.join(this.lobby.id)
    }
  }
}
