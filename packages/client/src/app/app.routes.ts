import { Routes, RouterModule } from '@angular/router';
import { AuthComponent, LoggedInGuard } from '@app/auth';
import { HomeComponent } from '@app/home/home.component';

const routes: Routes = [
  {path: 'login', component: AuthComponent},
  {
    path: 'lobbies',
    
    canActivate: [LoggedInGuard],
    children: [
      { path: '', component: HomeComponent }
      // {
      //   path: ':id', component: LobbyComponent
      // }
    ]
  },
  {path: '**', redirectTo: '/lobbies'},
];

export const AppRoutes = RouterModule.forRoot(routes);
