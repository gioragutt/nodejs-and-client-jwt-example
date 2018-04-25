import { Injectable } from '@angular/core';
import { connect } from 'socket.io-client';
import { AuthService } from '@core/auth.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { map } from 'rxjs/operators/map';
import { tap } from 'rxjs/operators/tap';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { environment } from '@env/environment';

export interface SocketStatus {
  connected: boolean;
  error?: any;
  event?: 'connect' | 'disconnect' | 'error';
}

@Injectable()
export class WebsocketService {
  private status$ = new BehaviorSubject<SocketStatus>({ connected: false });
  private socket: SocketIOClient.Socket;

  get currentStatus(): SocketStatus {
    return this.status$.getValue();
  }

  constructor(private auth: AuthService) {
    auth.profile().pipe(
      tap(profile => console.log('test me:', {profile})),
      map(profile => profile !== null),
      distinctUntilChanged(),
    ).subscribe(loggedIn => {
      if (loggedIn) {
        this.connect();
        console.log('socket -> connect');
      } else {
        this.disconnect();
        console.log('socket -> disconnect');
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  connect(): Observable<SocketStatus> {
    if (this.auth.loggedIn && !this.currentStatus.connected) {
      this.createSocket();
    }
    return this.status$.asObservable();
  }

  join<T>(room: string): void {
    this.socket.emit('join_room', room);
  }

  private updateStatus(update: Partial<SocketStatus>): void {
    this.status$.next({ ...this.currentStatus, ...update });
  }

  private createSocket(): void {
    this.socket = connect(environment.serverUrl, {
      query: {
        token: this.auth.jwtToken,
      },
    });

    this.socket.on('error', (error) => {
      this.updateStatus({ error, event: 'error' });
    });

    this.socket.on('connect', () => {
      this.updateStatus({ connected: true, error: null, event: 'connect' });
      this.socket.on('disconnect', () => this.updateStatus({ connected: false, event: 'disconnect' }));
      this.socket.on('message', msg => console.log('message', {msg}));
    });
  }
}
