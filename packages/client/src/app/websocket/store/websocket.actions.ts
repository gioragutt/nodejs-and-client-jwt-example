import { Action } from '@ngrx/store';

export enum WebsocketActionTypes {
  Connect = '[Websocket] Connect',
  Disconnect = '[Websocket] Disconnect',
  Error = '[Websocket] Error',
  EmitWebsocketMessage = '[Websocket] Emit Websocket Message',
}

export class Connect implements Action {
  readonly type = WebsocketActionTypes.Connect;
}

export class Disconnect implements Action {
  readonly type = WebsocketActionTypes.Disconnect;
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

export type WebsocketActions = Connect | Disconnect | Error | EmitWebsocketMessage;
