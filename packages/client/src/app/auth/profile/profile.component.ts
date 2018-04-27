import { Component, OnInit } from '@angular/core';
import { AuthService, Profile } from '@core/auth.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  constructor(public auth: AuthService) {}

  logout(): void {
    this.auth.logout().subscribe();
  }
}
