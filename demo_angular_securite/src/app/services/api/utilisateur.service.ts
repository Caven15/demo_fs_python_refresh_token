import { Injectable } from '@angular/core';
import { environment } from '../../../environement';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../../models/utilisateur.model';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = `${environment.apiUrl}/utilisateurs`;

  constructor(private http: HttpClient, private session : SessionService) {}

  getAllUtilisateurs(): Observable<Utilisateur[]> {
    // Récupération du token depuis le Local Storage
    const token = this.session.getToken();

    // // Configuration des en-têtes avec le token d'authentification
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`
    // });

    // Envoi de la requête avec les en-têtes de sécurité
    // return this.http.get<Utilisateur[]>(`${this.apiUrl}`, { headers });
    return this.http.get<Utilisateur[]>(`${this.apiUrl}`);
  }
}
