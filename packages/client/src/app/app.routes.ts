import { Routes, RouterModule } from '@angular/router';
import { AuthComponent, LoggedInGuard } from '@app/auth';
import { HomeComponent } from '@app/home/home.component';

const routes: Routes = [
  {path: 'login', component: AuthComponent},
  {
    path: '',
    component: HomeComponent,
    canActivate: [LoggedInGuard],
  },
  {path: '**', redirectTo: '/'},
];

export const AppRoutes = RouterModule.forRoot(routes);
