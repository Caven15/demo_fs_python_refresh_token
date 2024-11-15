import { Component } from '@angular/core';
import { Utilisateur } from '../../../../models/utilisateur.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrl: './all.component.css'
})
export class AllComponent {
  utilisateurs: Utilisateur[] = [];
  loading = true;
  countdown = 3; // Décompte initial en secondes

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Démarre le décompte pour le chargement
    const interval = setInterval(() => {
      this.countdown -= 1;
      if (this.countdown === 0) {
        clearInterval(interval);
      }
    }, 1000);

    // Récupère les utilisateurs une fois résolus par le resolver
    this.route.data.subscribe(data => {
      this.utilisateurs = data['utilisateurs'];
      this.loading = false; // Stop le message de chargement
    });
  }
}
