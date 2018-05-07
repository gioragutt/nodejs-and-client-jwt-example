import { Lobby } from './store';

export const isInLobby = (lobby: Lobby, user: string) => {
  return lobby && lobby.users.includes(user);
};

export const isOwner = (lobby: Lobby, user: string) => {
  return lobby && lobby.owner === user;
};
