import { Action } from '@ngrx/store';
import { Router, UrlTree, NavigationExtras } from '@angular/router';

export enum RouterActionTypes {
  NavigateTo = '[Router] Navigate To',
  NavigateBack = '[Router] Navigate Back',
  NavigateForward = '[Router] Navigate Forward',
}

export interface NavigatePayload {
  to: any[] | string | UrlTree;
  extras?: NavigationExtras;
}

export class NavigateTo implements Action {
  readonly type = RouterActionTypes.NavigateTo;
  constructor(public payload: NavigatePayload) {}
}

export class NavigateBack implements Action {
  readonly type = RouterActionTypes.NavigateBack;
}

export class NavigateForward implements Action {
  readonly type = RouterActionTypes.NavigateBack;
}
