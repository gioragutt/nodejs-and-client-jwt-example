import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import { RouterReducerState, DEFAULT_ROUTER_FEATURENAME, routerReducer, RouterStateSerializer } from '@ngrx/router-store'
import { Params, RouterStateSnapshot } from '@angular/router';

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export type RouterState = RouterReducerState<RouterStateUrl>

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const { url, root: { queryParams } } = routerState;
    const { params } = route;

    return { url, params, queryParams };
  }
}

export const selectRouterState = createFeatureSelector<RouterState>(
  DEFAULT_ROUTER_FEATURENAME);

export const reducer = routerReducer