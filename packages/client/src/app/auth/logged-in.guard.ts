import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '@core/auth.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('canActive');
    if (this.auth.loggedIn) {
      console.log('loggedIn');
      return true;
    }

    console.log('not loggedIn');
    this.router.navigate(['/login']);
    return false;
  }
}
