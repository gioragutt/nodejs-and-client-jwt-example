export interface CreateLobbyEvent {
  id: string;
  timestamp: number;
  event: 'create';
  owner: string;
}

export interface JoinLobbyEvent {
  id: string;
  timestamp: number;
  event: 'join';
  username: string;
}

export interface LeaveLobbyEvent {
  id: string;
  timestamp: number;
  event: 'leave';
  username: string;
}

export interface MessageLobbyEvent {
  id: string;
  timestamp: number;
  event: 'message';
  username: string;
  message: string;
}

export type LobbyEvent =
  | CreateLobbyEvent
  | JoinLobbyEvent
  | LeaveLobbyEvent
  | MessageLobbyEvent;

export interface Lobby {
  id: string;
  name: string;
  owner: string;
  users: string[],
  events: LobbyEvent[]
}