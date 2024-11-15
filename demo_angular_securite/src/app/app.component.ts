import { Component, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from './services/api/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  authStatus = computed(() => this.sessionService.authStatus());

  constructor(private router: Router, private sessionService: SessionService) {}

  ngOnInit() {}

  connecter() {
    this.router.navigate(['/auth/login']);
  }

  enregistrer() {
    this.router.navigate(['/auth/register']);
  }

  home() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.sessionService.removeToken();
  }

  voirUtilisateurs() {
    if (this.authStatus()) {
      this.router.navigate(['/utilisateur/list']);
    } else {
      alert("Vous devez être connecté pour voir la liste des utilisateurs.");
    }
  }
}
