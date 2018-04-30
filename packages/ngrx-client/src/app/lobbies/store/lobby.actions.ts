import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Lobby } from './lobby.model';

export enum LobbyActionTypes {
  FetchLobbies = '[Lobby] Fetch Lobbies',
  LoadLobbies = '[Lobby] Load Lobbies',
  AddLobby = '[Lobby] Add Lobby',
  UpsertLobby = '[Lobby] Upsert Lobby',
  AddLobbies = '[Lobby] Add Lobbies',
  UpsertLobbies = '[Lobby] Upsert Lobbies',
  UpdateLobby = '[Lobby] Update Lobby',
  UpdateLobbies = '[Lobby] Update Lobbies',
  DeleteLobby = '[Lobby] Delete Lobby',
  DeleteLobbies = '[Lobby] Delete Lobbies',
  ClearLobbies = '[Lobby] Clear Lobbies'
}

export class FetchLobbies implements Action {
  readonly type = LobbyActionTypes.FetchLobbies;
}

export class LoadLobbies implements Action {
  readonly type = LobbyActionTypes.LoadLobbies;
  constructor(public payload: { lobbies: Lobby[] }) { }
}

export class AddLobby implements Action {
  readonly type = LobbyActionTypes.AddLobby;
  constructor(public payload: { lobby: Lobby }) { }
}

export class UpsertLobby implements Action {
  readonly type = LobbyActionTypes.UpsertLobby;
  constructor(public payload: { lobby: Update<Lobby> }) { }
}

export class AddLobbies implements Action {
  readonly type = LobbyActionTypes.AddLobbies;
  constructor(public payload: { lobbies: Lobby[] }) { }
}

export class UpsertLobbies implements Action {
  readonly type = LobbyActionTypes.UpsertLobbies;
  constructor(public payload: { lobbies: Update<Lobby>[] }) { }
}

export class UpdateLobby implements Action {
  readonly type = LobbyActionTypes.UpdateLobby;
  constructor(public payload: { lobby: Update<Lobby> }) { }
}

export class UpdateLobbies implements Action {
  readonly type = LobbyActionTypes.UpdateLobbies;
  constructor(public payload: { lobbies: Update<Lobby>[] }) { }
}

export class DeleteLobby implements Action {
  readonly type = LobbyActionTypes.DeleteLobby;
  constructor(public payload: { id: string }) { }
}

export class DeleteLobbies implements Action {
  readonly type = LobbyActionTypes.DeleteLobbies;
  constructor(public payload: { ids: string[] }) { }
}

export class ClearLobbies implements Action {
  readonly type = LobbyActionTypes.ClearLobbies;
}

export type LobbyActions =
  | FetchLobbies
  | LoadLobbies
  | AddLobby
  | UpsertLobby
  | AddLobbies
  | UpsertLobbies
  | UpdateLobby
  | UpdateLobbies
  | DeleteLobby
  | DeleteLobbies
  | ClearLobbies;
