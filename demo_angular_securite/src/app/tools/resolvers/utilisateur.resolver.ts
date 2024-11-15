// src/app/resolvers/utilisateur.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { Utilisateur } from '../../models/utilisateur.model';
import { UtilisateurService } from '../../services/api/utilisateur.service';

export const utilisateurResolver: ResolveFn<Observable<Utilisateur[]>> = () => {
  const utilisateurService = inject(UtilisateurService);

  return utilisateurService.getAllUtilisateurs().pipe(
    delay(3000) // Simule un délai de 3 secondes
  );
};
