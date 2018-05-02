import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '@env/environment';
import { AuthData } from './store';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthData> {
    return this.http.post<AuthData>(`${environment.apiBaseUrl}/login`, { username, password });
  }
}
