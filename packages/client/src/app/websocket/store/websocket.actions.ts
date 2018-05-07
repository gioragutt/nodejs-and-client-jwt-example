import { Action } from '@ngrx/store';

export enum WebsocketActionTypes {
  Connected = '[Websocket] Connected',
  Disconnected = '[Websocket] Disconnected',
  Error = '[Websocket] Error',
  EmitWebsocketMessage = '[Websocket] Emit Websocket Message',
}

export class Connected implements Action {
  readonly type = WebsocketActionTypes.Connected;
}

export class Disconnected implements Action {
  readonly type = WebsocketActionTypes.Disconnected;
}

export class Error implements Action {
  readonly type = WebsocketActionTypes.Error;
  constructor(public error: any) {}
}

export class EmitWebsocketMessage implements Action {
  readonly type = WebsocketActionTypes.EmitWebsocketMessage;
  args: any[];
  constructor(public event: string, ...args: any[]) {
    this.args = args;
  }
}

export type WebsocketActions = Connected | Disconnected | Error | EmitWebsocketMessage;
