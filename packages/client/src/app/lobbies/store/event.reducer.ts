import { uniq, sortBy } from 'lodash';
import { Lobby, LobbyEvent } from './lobby.model';
import { removeItemsById } from 'redux-toolbelt-immutable-helpers';

export function eventReducer(state: Lobby, event: LobbyEvent): Lobby {
  switch (event.event) {
    case 'join': {
      const users = uniq([...state.users, event.username]).sort();
      return { ...state, users };
    }
    case 'leave': {
      const users = removeItemsById(state.users, [event.username], user => user);
      return { ...state, users };
    }
  }
  return state;
}
