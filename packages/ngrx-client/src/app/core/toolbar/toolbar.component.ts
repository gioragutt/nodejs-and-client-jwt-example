import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromAuth from '@app/auth';
import { Observable } from 'rxjs/Observable';
import { NavigateTo } from '@app/router';

@Component({
  selector: 'app-presentational-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationalToolbarComponent {
  @Input() authState: fromAuth.State;
  @Output() login = new EventEmitter();
  @Output() logout = new EventEmitter();
}

@Component({
  selector: 'app-toolbar',
  template: `
    <app-presentational-toolbar
      [authState]="authState$ | async"
      (login)="login()"
      (logout)="logout()"
    ></app-presentational-toolbar>
  `,
})
export class ToolbarComponent {
  authState$: Observable<fromAuth.State>;

  constructor(private store: Store<any>) {
    this.authState$ = this.store.select(fromAuth.selectAuthState);
  }

  login(): void {
    this.store.dispatch(new NavigateTo({to: '/login'}))
  }

  logout(): void {
    this.store.dispatch(new fromAuth.Logout())
  }
}
