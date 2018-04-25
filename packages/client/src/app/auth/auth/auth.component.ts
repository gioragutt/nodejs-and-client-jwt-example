import { Component } from '@angular/core';
import { AuthService } from '@core/auth.service';
import { Router } from '@angular/router';
import { AuthFormData } from '../auth-form/auth-form.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  constructor(private router: Router, private auth: AuthService) {
    this.navigateHomeIfLoggedIn();
  }

  private navigateHomeIfLoggedIn(): void {
    if (this.auth.loggedIn) {
      this.router.navigate(['']);
    }
  }

  onSubmit(event: AuthFormData): void {
    if (!event || event instanceof Event) {
      return;
    }

    this.auth.login(event.username, event.password).subscribe(
      () => this.navigateHomeIfLoggedIn(),
      error => console.error(error),
    );
  }
}
