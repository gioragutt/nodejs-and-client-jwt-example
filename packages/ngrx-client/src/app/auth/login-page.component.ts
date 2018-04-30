import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthFormData } from './auth-form';
import * as authStore from './store'

@Component({
  selector: 'app-login-page',
  template: `
    <div class="container">
      <app-auth-form submitText="login" (submit)="onSubmit($event)"></app-auth-form>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: auto;
    }
  `],
})
export class LoginPageComponent {
  constructor(private store: Store<authStore.State>) {
  }

  onSubmit(event: AuthFormData | Event) {
    if (!event || event instanceof Event) {
      return;
    }

    this.store.dispatch(new authStore.Login(event));
  }
  // constructor(private router: Router, private auth: AuthService) {
  //   this.navigateHomeIfLoggedIn();
  // }

  // private navigateHomeIfLoggedIn(): void {
  //   if (this.auth.loggedIn) {
  //     this.router.navigate(['']);
  //   }
  // }

  // onSubmit(event: AuthFormData): void {
  //   if (!event || event instanceof Event) {
  //     return;
  //   }

  //   this.auth.login(event.username, event.password).subscribe(
  //     () => this.navigateHomeIfLoggedIn(),
  //     error => console.error(error),
  //   );
  // }
}
