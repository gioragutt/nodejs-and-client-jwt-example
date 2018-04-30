import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/auth';
import { LobbiesHomeComponent } from './lobbies-home';

const routes: Routes = [{
  path: 'lobbies',
  canActivate: [AuthGuard],
  children: [
    { path: '', component: LobbiesHomeComponent, canActivate: [AuthGuard] },
    { path: '**', pathMatch: 'full', redirectTo: '' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LobbiesRoutingModule { }
