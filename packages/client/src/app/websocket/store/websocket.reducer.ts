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
    case WebsocketActionTypes.WebsocketConnectionChanged: {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
}

export const selectWebsocketState = createFeatureSelector('websocket')

export const selectConnected = createSelector(
  selectWebsocketState,
  (state: State) => state.connected,
)