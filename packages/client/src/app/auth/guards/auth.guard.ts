import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthData, selectLoggedIn } from '../store';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<any>) { }
  
  canActivate(): Observable<boolean> {
    return this.store.select(selectLoggedIn);
  }
}