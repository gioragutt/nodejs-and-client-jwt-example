import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AuthData } from './auth.models';
import { AuthActions, AuthActionTypes } from './auth.actions';
import { loadFromStorage } from '@app/shared/storage';

export const AUTH_DATA_STORAGE_KEY = 'AUTH_DATA_STORAGE_KEY'

export interface State {
  data: AuthData;
  loading: boolean;
  error: any;
}

export const initialState: State = loadFromStorage(AUTH_DATA_STORAGE_KEY) || {
  data: null,
  error: null,
  loading: false,
};

export function reducer(state = initialState, action: AuthActions): State {
  switch(action.type) {
    case (AuthActionTypes.Login): {
      return {
        ...state,
        loading: true,
      };
    }

    case (AuthActionTypes.LoginSuccess): {
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload
      }
    }

    case (AuthActionTypes.LoginFailure): {
      return {
        ...state,
        loading: false,
        error: action.payload,
        data: null,
      }
    }

    case (AuthActionTypes.Logout): {
      return {
        ...state,
        data: null,
        loading: false,
        error: null,
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

export const getLoggedIn = createSelector(
  getAuthData,
  (data: AuthData) => data !== null,
)

export const getAuthDataLoading = createSelector(
  getAuthState,
  ({loading}: State) => loading,
)

export const getAuthDataError = createSelector(
  getAuthState,
  ({error}: State) => error,
)
