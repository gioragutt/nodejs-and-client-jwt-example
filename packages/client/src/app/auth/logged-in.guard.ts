import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '@core/auth.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.loggedIn) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
