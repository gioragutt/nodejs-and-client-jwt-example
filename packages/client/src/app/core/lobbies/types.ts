export type EventsList = Array<LobbyEvent | MessageLobbyEvent>

export interface Lobby {
  id: string;
  users: string[];
  events: EventsList;
}

export interface UserJoinedOrLeftLobby {
  lobby: Lobby;
  username: string;
}

export interface LobbyEvent {
  id: string;
  event: string;
  timestamp: number;
  username?: string;
}

export interface MessageLobbyEvent extends LobbyEvent {
  event: 'message';
  message: string;
}