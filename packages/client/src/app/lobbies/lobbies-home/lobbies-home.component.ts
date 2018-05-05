import { Component, HostBinding } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Lobby, selectAllLobbies, FetchLobbies } from '../store';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-lobbies-home',
  templateUrl: './lobbies-home.component.html',
  styleUrls: ['./lobbies-home.component.scss'],
})
export class LobbiesHomeComponent {
  @HostBinding('class') hostClass = 'routed-component';
  lobbies$: Observable<Lobby[]>;
  constructor(private store: Store<any>) {
    this.lobbies$ = this.store.select(selectAllLobbies);
  }
}
