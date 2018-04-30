import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Lobby } from './lobby.model';
import { LobbyActions, LobbyActionTypes } from './lobby.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectRouterState } from '@app/router';
import { RouterStateSnapshot, Params } from '@angular/router';

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

const getParams = (state: RouterStateSnapshot): Params => {
  let child = state.root.firstChild;
  while (child.firstChild) {
    child = child.firstChild;
  }
  return child.params
}

export const selectSelectedLobby = createSelector(
  selectLobbyEntities,
  selectRouterState,
  (lobbies, router): Lobby => {
    const lobbyId = getParams(router.state)['lobbyId']
    return lobbies[lobbyId]
  }
)