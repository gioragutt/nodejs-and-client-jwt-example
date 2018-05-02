import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Lobby, selectAllLobbies, FetchLobbies } from '../store';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-lobbies-home',
  templateUrl: './lobbies-home.component.html',
  styleUrls: ['./lobbies-home.component.scss'],
  host: {
    class: 'routed-component'
  },
})
export class LobbiesHomeComponent implements OnInit {
  lobbies$: Observable<Lobby[]>;
  constructor(private store: Store<any>) {
    this.lobbies$ = this.store.select(selectAllLobbies)
  }

  ngOnInit(): void {
    this.store.dispatch(new FetchLobbies());
  }
}
