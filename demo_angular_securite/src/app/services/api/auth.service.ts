import { Injectable } from '@angular/core';
import { environment } from '../../../environement';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Utilisateur } from '../../models/utilisateur.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  private accessTokenSubject = new BehaviorSubject<string | null>(this.getAccessToken());
  public accessToken$ = this.accessTokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(user: Utilisateur): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(
      tap(tokens => {
        this.setTokens(tokens.access_token, tokens.refresh_token);
      })
    );
  }

  register(user: Utilisateur): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    console.log("refesh du token en cours");
    return this.http.post<any>(`${this.apiUrl}/refresh`, { refresh_token: refreshToken }).pipe(
      tap(tokens => {
        this.setTokens(tokens.access_token, this.getRefreshToken());
      })
    );
  }

  private setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    this.accessTokenSubject.next(accessToken);
  }

  private getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  private getRefreshToken(): string {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY) || '';
  }
}
