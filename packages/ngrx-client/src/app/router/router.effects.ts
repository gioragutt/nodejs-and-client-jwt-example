import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Location } from '@angular/common';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { NavigateBack, NavigateTo, NavigateForward, NavigatePayload } from './router.actions';

@Injectable()
export class RouterEffects {
  @Effect({ dispatch: false })
  navigateTo$ = this.actions$.pipe(
    ofType(NavigateTo.TYPE),
    map((action: NavigateTo) => action.payload),
    tap(({ to, extras }: NavigatePayload) => {
      if (to instanceof UrlTree || typeof to === 'string') {
        this.router.navigateByUrl(to, extras);
      } else {
        this.router.navigate(to, extras);
      }
    })
  );

  @Effect({ dispatch: false })
  navigateBack$ = this.actions$.pipe(
    ofType(NavigateBack.TYPE),
    tap(() => this.location.back())
  );

  @Effect({ dispatch: false })
  navigateForward$ = this.actions$.pipe(
    ofType(NavigateForward.TYPE),
    tap(() => this.location.forward())
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location
  ) {}
}