import { Action } from '@ngrx/store';
import { Router, UrlTree, NavigationExtras } from '@angular/router';

export interface NavigatePayload {
  to: any[] | string | UrlTree;
  extras?: NavigationExtras;
}

export class NavigateTo implements Action {
  static TYPE = '[Router] Navigate To';
  type = NavigateTo.TYPE;
  constructor(public payload: NavigatePayload) {}
}

export class NavigateBack implements Action {
  static TYPE = '[Router] Navigate Back';
  type = NavigateBack.TYPE;
}

export class NavigateForward implements Action {
  static TYPE = '[Router] Navigate Forward';
  type = NavigateBack.TYPE;
}