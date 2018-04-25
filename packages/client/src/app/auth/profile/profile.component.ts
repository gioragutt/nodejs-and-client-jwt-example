import { Component, OnInit } from '@angular/core';
import { AuthService, Profile } from '@core/auth.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  profile$: Observable<Profile | null> = null;

  constructor(private auth: AuthService) {
    this.profile$ = auth.profile();
  }

  logout(): void {
    this.auth.logout().subscribe();
  }
}
