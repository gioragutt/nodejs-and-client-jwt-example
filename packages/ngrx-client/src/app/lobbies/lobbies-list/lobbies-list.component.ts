import { Component, OnInit, Input } from '@angular/core';
import { Lobby } from '../store';

@Component({
  selector: 'app-lobbies-list',
  templateUrl: './lobbies-list.component.html',
  styleUrls: ['./lobbies-list.component.scss']
})
export class LobbiesListComponent {
  @Input() lobbies: Lobby[];
}
