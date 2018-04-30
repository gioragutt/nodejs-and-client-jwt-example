import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import { RouterReducerState, DEFAULT_ROUTER_FEATURENAME, routerReducer } from '@ngrx/router-store'

export interface AppState {
  routerReducer: RouterReducerState
}

export const selectRouterState = createFeatureSelector<RouterReducerState>(
  DEFAULT_ROUTER_FEATURENAME);

export const reducer = routerReducer