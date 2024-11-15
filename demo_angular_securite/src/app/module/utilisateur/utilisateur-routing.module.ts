import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllComponent } from './components/all/all.component';
import { utilisateurResolver } from '../../tools/resolvers/utilisateur.resolver';

const routes: Routes = [
  { path: 'list', component: AllComponent, resolve: { utilisateurs: utilisateurResolver }  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilisateurRoutingModule { }
