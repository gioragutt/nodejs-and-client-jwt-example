export interface LobbyEvent {
  id: string;
  timestamp: number;
  event: string;
  context: {[key: string]: any}
}

export interface Lobby {
  id: string;
  name: string;
  users: string[],
  events: LobbyEvent[]
}