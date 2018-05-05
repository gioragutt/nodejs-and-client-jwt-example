import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/auth';
import { LobbiesHomeComponent } from './lobbies-home';
import { LobbyComponent } from './lobby';

const routes: Routes = [
  {
    path: 'lobbies',
    canActivate: [AuthGuard],
    component: LobbiesHomeComponent,
    children: [{ path: ':lobbyId', component: LobbyComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LobbiesRoutingModule {}
