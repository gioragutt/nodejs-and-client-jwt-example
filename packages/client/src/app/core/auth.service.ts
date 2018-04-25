import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment as env } from '@env/environment';
import { tap } from 'rxjs/operators/tap';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';

import { switchMap } from 'rxjs/operators/switchMap';

import { getStorage, setStorage } from '@app/utils';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';

export interface Profile {
  username: string;
}

export interface AuthResponse {
  profile: Profile;
  token: string;
}

@Injectable()
export class AuthService {
  private profile$ = new BehaviorSubject<Profile>(this.currentProfile);

  constructor(private http: HttpClient, private router: Router) {
    this.profile$.subscribe(profile => console.log('ad matay', {profile}));
  }

  profile(): Observable<Profile> {
    return this.profile$;
  }

  get loggedIn(): boolean {
    return this.jwtToken !== null;
  }

  signup(username: string, password: string): Observable<{}> {
    return this.http.post(`${env.apiBaseUrl}/signup`, { username, password });
  }

  login(username: string, password: string): Observable<Profile> {
    return this.http.post<AuthResponse>(`${env.apiBaseUrl}/login`, { username, password }).pipe(
      tap(res => {
        setStorage(env.jwtStorageKey, res.token);
        setStorage(env.profileStorageKey, res.profile);
        this.profile$.next(res.profile);
      }),
      switchMap(() => this.profile()),
      catchError(e => {
        this.resetAuthData();
        return of(null);
      }),
    );
  }

  logout(): Observable<null> {
    return defer(() => {
      this.resetAuthData();
      this.router.navigate(['/login']);
      return of(null);
    });
  }

  private resetAuthData(): void {
    setStorage(env.jwtStorageKey, undefined);
    setStorage(env.profileStorageKey, undefined);
    this.profile$.next(null);
  }

  get currentProfile(): Profile {
    return getStorage<Profile>(env.profileStorageKey);
  }

  get jwtToken(): string {
    return getStorage<string>(env.jwtStorageKey);
  }
}
