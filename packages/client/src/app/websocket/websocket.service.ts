import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter, take, switchMap } from 'rxjs/operators';
import { combineLatest ,  Observable } from 'rxjs';
import { environment } from '@env/environment';
import { connect } from 'socket.io-client';
import { selectToken, selectLoggedIn } from '@app/auth';

import { selectConnected } from './store/websocket.reducer';
import * as fromWs from './store/websocket.actions';
import { SubjectMap } from '@app/shared/subject-map';

@Injectable()
export class WebsocketService {
  socket: SocketIOClient.Socket;
  firstConnection$: Observable<{}>;
  subjects = new SubjectMap();

  constructor(private store: Store<any>) {
    combineLatest(
      this.store.select(selectLoggedIn).pipe(distinctUntilChanged()),
      this.store.select(selectToken).pipe(distinctUntilChanged()),
    ).subscribe(([loggedIn, token]) => {
      if (loggedIn) {
        this.connect(token);
      } else {
        this.disconnect();
      }
    });

    this.firstConnection$ = this.store
      .select(selectConnected)
      .pipe(filter(connected => connected), take(1));
  }

  on<T>(event: string): Observable<T> {
    if (this.subjects.has(event)) {
      return this.subjects.get<T>(event).asObservable();
    }

    return this.firstConnection$.pipe(
      switchMap(() => {
        const subject = this.subjects.get<T>(event);
        this.socket.on(event, (value: T) => subject.next(value));
        return subject.asObservable();
      }),
    );
  }

  emit(event: string, ...args: any[]): void {
    this.socket.emit(event, ...args);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private connect(token: string): void {
    this.disconnect();
    this.socket = connect(environment.serverUrl, { query: { token } });
    this.socket.on('error', error => this.store.dispatch(new fromWs.Error(error)));
    this.socket.on('connect', () => {
      this.store.dispatch(new fromWs.Connected());
      this.socket.on('disconnect', () => this.store.dispatch(new fromWs.Disconnected()));
      this.socket.on('message', msg => console.log('message', { msg }));
    });
  }
}
