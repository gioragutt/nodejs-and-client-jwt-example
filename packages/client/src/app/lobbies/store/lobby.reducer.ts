import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Lobby } from './lobby.model';
import { LobbyActions, LobbyActionTypes } from './lobby.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectRouterState } from '@app/router';
import { RouterStateSnapshot, Params } from '@angular/router';
import { eventReducer } from './event.reducer';

export interface State extends EntityState<Lobby> {
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<Lobby> = createEntityAdapter<Lobby>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  error: null,
});

export function reducer(state = initialState, action: LobbyActions): State {
  switch (action.type) {
    case LobbyActionTypes.AddEvent: {
      const {event} = action.payload;
      const lobby = state.entities[event.id];
      const updatedLobby = eventReducer({
        ...lobby,
        events: [...lobby.events, event]
      }, event)
      return adapter.updateOne({id: event.id, changes: updatedLobby}, state);
    }

    case LobbyActionTypes.AddLobby: {
      return adapter.addOne(action.payload.lobby, state);
    }

    case LobbyActionTypes.UpsertLobby: {
      return adapter.upsertOne(action.payload.lobby, state);
    }

    case LobbyActionTypes.AddLobbies: {
      return adapter.addMany(action.payload.lobbies, state);
    }

    case LobbyActionTypes.UpsertLobbies: {
      return adapter.upsertMany(action.payload.lobbies, state);
    }

    case LobbyActionTypes.UpdateLobby: {
      return adapter.updateOne(action.payload.lobby, state);
    }

    case LobbyActionTypes.UpdateLobbies: {
      return adapter.updateMany(action.payload.lobbies, state);
    }

    case LobbyActionTypes.DeleteLobby: {
      return adapter.removeOne(action.payload.id, state);
    }

    case LobbyActionTypes.DeleteLobbies: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case LobbyActionTypes.LoadLobbies: {
      return adapter.addAll(action.payload.lobbies, state);
    }

    case LobbyActionTypes.ClearLobbies: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds: selectLobbyIds,
  selectEntities: selectLobbyEntities,
  selectAll: selectAllLobbies,
  selectTotal: selectTotalLobbies,
} = adapter.getSelectors(createFeatureSelector('lobbies'));

export const selectSelectedLobby = createSelector(
  selectLobbyEntities,
  selectRouterState,
  (lobbies, router): Lobby => lobbies[router.state.params.lobbyId]
)