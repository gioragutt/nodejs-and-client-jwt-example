import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthData, selectLoggedIn } from '../store';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<any>, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.store.select(selectLoggedIn).pipe(tap(this.navigateToLoginIfLoggedOut));
  }

  private navigateToLoginIfLoggedOut = (loggedIn) => {
    if (!loggedIn) {
      this.router.navigate(['/login']);
    }
  }
}
