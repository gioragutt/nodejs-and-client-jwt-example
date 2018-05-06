import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectAuthData, AuthData, selectLoggedIn } from '../store';

@Injectable()
export class AnonymousGuard implements CanActivate {
  constructor(private store: Store<any>, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.store.select(selectLoggedIn).pipe(
      map(loggedIn => !loggedIn),
      tap(this.navigateToAppIfLoggedIn),
    );
  }

  private navigateToAppIfLoggedIn = (loggedOut) => {
    if (!loggedOut) {
      this.router.navigate(['/lobbies']);
    }
  }
}
