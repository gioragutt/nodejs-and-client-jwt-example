import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectRoutedLobby } from './store';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LobbyExistsGuard implements CanActivate {
  constructor(private store: Store<any>, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.store.select(selectRoutedLobby).pipe(
      map(lobby => !!lobby),
      tap(exists => {
        if (!exists) {
          this.router.navigate(['/lobbies']);
        }
      }),
    );
  }
}
