import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter, take, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { environment } from '@env/environment';
import { connect } from 'socket.io-client';
import { selectToken, selectLoggedIn } from '@app/auth';

import { selectConnected } from './store/websocket.reducer'
import { WebsocketConnectionChanged, EmitWebsocketMessage } from './store/websocket.actions'
import { Observable } from 'rxjs/Observable';
import { SubjectMap } from '@app/shared/subject-map';

@Injectable()
export class WebsocketService {
  socket: SocketIOClient.Socket;
  firstConnection$: Observable<{}>;
  subjects = new SubjectMap();
  
  constructor(private store: Store<any>) {
    combineLatest(
      this.store.select(selectLoggedIn).pipe(distinctUntilChanged()),
      this.store.select(selectToken).pipe(distinctUntilChanged())
    ).subscribe(([loggedIn, token]) => {
      if (loggedIn) {
        this.connect(token);
      } else {
        this.disconnect();
      }
    });

    this.firstConnection$ = this.store.select(selectConnected).pipe(
      filter(connected => connected),
      take(1),
    )
  }

  on<T>(event: string): Observable<T> {
    if (this.subjects.has(event)) {
      return this.subjects.get<T>(event).asObservable();
    }

    return this.firstConnection$.pipe(
      switchMap(() => {
        const subject = this.subjects.get<T>(event);
        this.socket.on(event, (value: T) => subject.next(value));
        return subject.asObservable()
      })
    )
  }

  emit(event: string, ...args: any[]): void {
    this.socket.emit(event, ...args);
  }

  disconnect(): void {
    if (this.socket) {
      console.log('disconnecting websocket');
      this.socket.disconnect();
      this.socket = null
    }
  }

  private updateStatus(payload: {connected?: boolean, error?: any}) {
    this.store.dispatch(new WebsocketConnectionChanged(payload));
  }

  private connect(token: string): void {
    this.disconnect();
    console.log('connecting');
    setTimeout(() => {
      this.store.dispatch(new EmitWebsocketMessage('message', 'hello world'))
    }, 5000)
    this.socket = connect(environment.serverUrl, {query: {token}});
    this.socket.on('error', error => this.updateStatus({error}));
    this.socket.on('connect', () => {
      this.updateStatus({connected: true, error: null});
      this.socket.on('disconnect', () => this.updateStatus({connected: false}));
      this.socket.on('message', msg => console.log('message', {msg}));
    });
  }
}
