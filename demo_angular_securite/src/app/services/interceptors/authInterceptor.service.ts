import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../api/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    let authReq = req;

    // Clone la requête et ajoute le token dans les en-têtes, s'il est présent
    if (token) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    // Gère les erreurs 401 (access token expiré)
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && token) {
          if (!this.isRefreshing) {
            // Demande de confirmation de prolongation de session
            const shouldExtendSession = window.confirm(
              "Votre session a expiré. Voulez-vous prolonger votre session ? Cliquez sur 'Annuler' pour vous déconnecter."
            );

            if (shouldExtendSession) {
              // Déclencher le rafraîchissement du token
              this.isRefreshing = true;
              this.refreshTokenSubject.next(null);

              return this.authService.refreshToken().pipe(
                switchMap((newTokens: any) => {
                  this.isRefreshing = false;
                  localStorage.setItem(this.ACCESS_TOKEN_KEY, newTokens.access_token);
                  localStorage.setItem(this.REFRESH_TOKEN_KEY, newTokens.refresh_token);
                  this.refreshTokenSubject.next(newTokens.access_token);

                  // Refaire la requête initiale avec le nouveau token
                  const retryReq = req.clone({
                    headers: req.headers.set('Authorization', `Bearer ${newTokens.access_token}`)
                  });
                  return next.handle(retryReq);
                }),
                catchError(refreshError => {
                  // Si le rafraîchissement échoue, déconnecter l'utilisateur
                  this.isRefreshing = false;
                  localStorage.removeItem(this.ACCESS_TOKEN_KEY);
                  localStorage.removeItem(this.REFRESH_TOKEN_KEY);
                  this.router.navigate(['/login']);  // Rediriger vers la page de connexion
                  return throwError(refreshError);
                })
              );
            } else {
              // Si l'utilisateur choisit de se déconnecter
              localStorage.removeItem(this.ACCESS_TOKEN_KEY);
              localStorage.removeItem(this.REFRESH_TOKEN_KEY);
              this.router.navigate(['/login']);
              return throwError(error);
            }
          } else {
            // Si un rafraîchissement est déjà en cours, attendre qu'il se termine
            return this.refreshTokenSubject.pipe(
              filter((token) => token != null),
              take(1),
              switchMap((newToken) => {
                const retryReq = req.clone({
                  headers: req.headers.set('Authorization', `Bearer ${newToken}`)
                });
                return next.handle(retryReq);
              })
            );
          }
        }
        return throwError(error);  // Propager l'erreur si autre que 401
      })
    );
  }
}
