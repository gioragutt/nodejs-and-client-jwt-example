import { Routes, RouterModule } from '@angular/router';
import { AuthComponent, LoggedInGuard } from '@app/auth';
import { LobbiesComponent } from '@app/lobbies/lobbies.component';
import { LobbyItemComponent } from '@app/lobbies/lobby-item/lobby-item.component';

const routes: Routes = [
  { path: 'login', component: AuthComponent },
  {
    path: 'lobbies',
    component: LobbiesComponent,
    canActivate: [LoggedInGuard],
    children: [
      { path: ':id', component: LobbyItemComponent }
    ]
  },
  { path: '**', redirectTo: '/lobbies' },
];

export const AppRoutes = RouterModule.forRoot(routes);
