import { Action } from '@ngrx/store';

export enum WebsocketActionTypes {
  WebsocketConnectionChanged = '[Websocket] Websocket Connection Changed',
  EmitWebsocketMessage = '[Websocket] Emit Websocket Message',
}

export class WebsocketConnectionChanged implements Action {
  readonly type = WebsocketActionTypes.WebsocketConnectionChanged;
  constructor(public payload: {connected?: boolean, error?: any}) { }
}

export class EmitWebsocketMessage implements Action {
  readonly type = WebsocketActionTypes.EmitWebsocketMessage;
  args: any[]
  constructor(public event: string, ...args: any[]) {
    this.args = args;
  }
}

export type WebsocketActions = 
  | WebsocketConnectionChanged
  | EmitWebsocketMessage;
