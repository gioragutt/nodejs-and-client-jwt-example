import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/auth';
import { LobbiesShellComponent } from './lobbies-shell';
import { LobbyComponent } from './lobby';

const routes: Routes = [
  {
    path: 'lobbies',
    canActivate: [AuthGuard],
    component: LobbiesShellComponent,
    children: [
      { path: ':lobbyId', component: LobbyComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LobbiesRoutingModule {}
