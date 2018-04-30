import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromAuth from '@app/auth';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-presentational-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationalToolbarComponent {
  @Input() authState: fromAuth.State;
}

@Component({
  selector: 'app-toolbar',
  template: `
    <app-presentational-toolbar
      [authState]="authState$ | async"
    ></app-presentational-toolbar>
  `,
})
export class ToolbarComponent {
  authState$: Observable<fromAuth.State>;
  constructor(private store: Store<any>) {
    this.authState$ = this.store.select(fromAuth.getAuthState);
  }
}
