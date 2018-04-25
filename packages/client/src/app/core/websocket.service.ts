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
import { SubjectMap } from '@app/utils';

export interface SocketStatus {
  connected: boolean;
  error?: any;
  event?: 'connect' | 'disconnect' | 'error';
}

@Injectable()
export class WebsocketService {
  private status = new BehaviorSubject<SocketStatus>({ connected: false });
  private socket: SocketIOClient.Socket;
  private subjects = new SubjectMap();
  private _statusChanged: Observable<boolean>;

  get statusChanged$(): Observable<boolean> {
    return this._statusChanged;
  }

  get currentStatus(): SocketStatus {
    return this.status.getValue();
  }

  constructor(private auth: AuthService) {
    this._statusChanged = this.status.pipe(
      map(status => status.connected),
      distinctUntilChanged(),
    );

    auth.profile().pipe(
      map(profile => profile !== null),
      distinctUntilChanged(),
    ).subscribe(loggedIn => {
      if (loggedIn) {
        this.connect();
      } else {
        this.disconnect();
      }
    })
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
    return this.status.asObservable();
  }

  emit(event: string, ...args: any[]): void {
    this.socket.emit(event, ...args);
  }

  on<T>(event: string): Observable<T> {
    const subject = this.subjects.get<T>(event);
    this.socket.on(event, (value: T) => subject.next(value));
    return subject.asObservable();
  }

  private updateStatus(update: Partial<SocketStatus>): void {
    this.status.next({ ...this.currentStatus, ...update });
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
