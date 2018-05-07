import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { WebsocketActions, WebsocketActionTypes } from './websocket.actions';

export interface State {
  connected: boolean;
  error: any;
}

export const initialState: State = {
  connected: false,
  error: null,
};

export function reducer(state = initialState, action: WebsocketActions): State {
  switch (action.type) {
    case WebsocketActionTypes.Connected: {
      return { ...state, connected: true, error: null };
    }
    case WebsocketActionTypes.Disconnected: {
      return { ...state, connected: false };
    }
    case WebsocketActionTypes.Error: {
      return { ...state, error: action.error };
    }
    default:
      return state;
  }
}

export const selectWebsocketState = createFeatureSelector('websocket');

export const selectConnected = createSelector(
  selectWebsocketState,
  (state: State) => state.connected,
);
