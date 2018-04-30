import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AuthData } from './auth.models';
import * as fromAuth from './auth.actions';
import { loadFromStorage } from '@app/shared/storage';

export const AUTH_DATA_STORAGE_KEY = 'AUTH_DATA_STORAGE_KEY'

export interface State {
  data: AuthData;
  loading: boolean;
  loaded: boolean;
  error: any;
}

export const initialState: State = loadFromStorage(AUTH_DATA_STORAGE_KEY) || {
  data: null,
  error: null,
  loading: false,
  loaded: false,
};

export function reducer(state = initialState, action: fromAuth.LoginActions): State {
  switch(action.type) {
    case (fromAuth.Login.TYPE): {
      return {
        ...state,
        loading: true,
      };
    }

    case (fromAuth.LoginSuccess.TYPE): {
      return {
        ...state,
        loading: false,
        loaded: true,
        error: null,
        data: action.payload
      }
    }

    case (fromAuth.LoginFailure.TYPE): {
      return {
        ...state,
        loading: false,
        error: action.payload,
        loaded: false,
        data: null,
      }
    }
  }
  return state;
}

export const getAuthState = createFeatureSelector<State>('auth')

export const getAuthData = createSelector(
  getAuthState,
  ({data}: State) => data,
)

export const getAuthDataLoading = createSelector(
  getAuthState,
  ({loading}: State) => loading,
)

export const getAuthDataLoaded = createSelector(
  getAuthState,
  ({loaded}: State) => loaded,
)

export const getAuthDataError = createSelector(
  getAuthState,
  ({error}: State) => error,
)
