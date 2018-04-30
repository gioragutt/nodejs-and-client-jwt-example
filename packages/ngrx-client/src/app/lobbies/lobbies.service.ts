import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Lobby } from './store';
import { Observable } from 'rxjs/Observable';
import { environment } from '@env/environment';

@Injectable()
export class LobbiesService {

  constructor(private http: HttpClient) {}

  fetchAll(): Observable<Lobby[]> {
    return this.http.get<Lobby[]>(`${environment.apiBaseUrl}/lobbies`);
  }
}
