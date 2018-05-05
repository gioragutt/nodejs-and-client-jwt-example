import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Location } from '@angular/common';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import * as routerActions from './router.actions';

@Injectable()
export class RouterEffects {
  @Effect({ dispatch: false })
  navigateTo$ = this.actions$.pipe(
    ofType(routerActions.RouterActionTypes.NavigateTo),
    map((action: routerActions.NavigateTo) => action.payload),
    tap(({ to, extras }: routerActions.NavigatePayload) => {
      if (to instanceof UrlTree || typeof to === 'string') {
        this.router.navigateByUrl(to, extras);
      } else {
        this.router.navigate(to, extras);
      }
    }),
  );

  @Effect({ dispatch: false })
  navigateBack$ = this.actions$.pipe(
    ofType(routerActions.RouterActionTypes.NavigateBack),
    tap(() => this.location.back()),
  );

  @Effect({ dispatch: false })
  navigateForward$ = this.actions$.pipe(
    ofType(routerActions.RouterActionTypes.NavigateForward),
    tap(() => this.location.forward()),
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location,
  ) {}
}
