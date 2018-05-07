import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/auth';

import { LobbiesShellComponent } from './lobbies-shell';
import { LobbyComponent } from './lobby';
import { LobbiesHomeComponent } from './lobbies-home';

const routes: Routes = [
  {
    path: 'lobbies',
    canActivate: [AuthGuard],
    component: LobbiesShellComponent,
    children: [
      { path: '', component: LobbiesHomeComponent },
      { path: ':lobbyId', component: LobbyComponent },
      { path: '**', pathMatch: 'full', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LobbiesRoutingModule {}
