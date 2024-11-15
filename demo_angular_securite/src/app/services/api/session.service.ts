import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly TOKEN_KEY = 'accessToken';  // Alignez ce nom avec celui utilisé dans AuthService

  // Signal pour suivre l'état d'authentification
  authStatus = signal<boolean>(this.isAuthenticated());

  /**
   * Vérifie si localStorage est disponible
   */
  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  /**
   * Récupère le token depuis le localStorage
   */
  getToken(): string | null {
    return this.isLocalStorageAvailable() ? localStorage.getItem(this.TOKEN_KEY) : null;
  }

  /**
   * Définit le token dans le localStorage et met à jour le signal d'authentification
   */
  setToken(token: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.TOKEN_KEY, token);
      this.authStatus.set(true);
    }
  }

  /**
   * Supprime le token du localStorage et met à jour le signal d'authentification
   */
  removeToken(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.clear();
      this.authStatus.set(false);
    }
  }

  /**
   * Vérifie si l'utilisateur est authentifié en vérifiant la présence d'un token
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
