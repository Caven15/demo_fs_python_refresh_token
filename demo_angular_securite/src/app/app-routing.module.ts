import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {path: 'auth',loadChildren: () => import('./module/auth/auth.module').then(m => m.AuthModule)},
  {path: 'utilisateur',loadChildren: () => import('./module/utilisateur/utilisateur.module').then(m => m.UtilisateurModule)},
  { path: 'home', component : HomeComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirection par défaut
  { path: '**', redirectTo: '/auth/login' } // Redirection pour routes inconnues
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
