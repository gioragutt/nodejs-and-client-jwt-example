import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromAuth from '@app/auth';
import { Observable } from 'rxjs/Observable';
import { NavigateTo } from '@app/router';
import * as fromWebsocket from '@app/websocket';

@Component({
  selector: 'app-presentational-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationalToolbarComponent {
  @Input() authState: fromAuth.State;
  @Input() websocketConnected: boolean;
  @Output() login = new EventEmitter();
  @Output() logout = new EventEmitter();
}

@Component({
  selector: 'app-toolbar',
  template: `
    <app-presentational-toolbar
      [authState]="authState$ | async"
      [websocketConnected]="websocketConnected$ | async"
      (login)="login()"
      (logout)="logout()"
    ></app-presentational-toolbar>
  `,
})
export class ToolbarComponent {
  authState$ = this.store.select(fromAuth.selectAuthState);
  websocketConnected$ = this.store.select(fromWebsocket.selectConnected);

  constructor(private store: Store<any>) { }

  login(): void {
    this.store.dispatch(new NavigateTo({to: '/login'}));
  }

  logout(): void {
    this.store.dispatch(new fromAuth.Logout());
  }
}
