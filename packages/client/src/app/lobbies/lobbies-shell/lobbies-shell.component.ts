import { Component, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';
import { Lobby, FetchLobbies, selectJoinedLobbies } from '../store';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-lobbies-shell',
  templateUrl: './lobbies-shell.component.html',
  styleUrls: ['./lobbies-shell.component.scss'],
})
export class LobbiesShellComponent {
  @HostBinding('class') hostClass = 'routed-component';
  lobbies$: Observable<Lobby[]>;
  constructor(private store: Store<any>) {
    this.lobbies$ = this.store.select(selectJoinedLobbies);
  }
}
