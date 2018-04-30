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
        data: action.authData
      }
    }

    case (AuthActionTypes.LoginFailure): {
      return {
        ...state,
        loading: false,
        error: action.error,
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

export const selectAuthState = createFeatureSelector<State>('auth')

export const selectAuthData = createSelector(
  selectAuthState,
  ({data}: State) => data,
)

export const selectLoggedIn = createSelector(
  selectAuthData,
  (data: AuthData) => data !== null,
)

export const selectAuthDataLoading = createSelector(
  selectAuthState,
  ({loading}: State) => loading,
)

export const selectAuthDataError = createSelector(
  selectAuthState,
  ({error}: State) => error,
)
