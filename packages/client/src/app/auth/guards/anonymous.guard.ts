import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectAuthData, AuthData, selectLoggedIn } from '../store';
import { NavigateTo } from '@app/router';

@Injectable()
export class AnonymousGuard implements CanActivate {
  constructor(private store: Store<any>) { }
  
  canActivate(): Observable<boolean> {
    return this.store.select(selectLoggedIn).pipe(
      map(loggedIn => !loggedIn),
      tap(this.navigateToAppIfLoggedIn)
    );
  }

  private navigateToAppIfLoggedIn = (loggedOut) => {
    if (!loggedOut) {
      this.store.dispatch(new NavigateTo({to: '/lobbies'}))
    }
  }
}
