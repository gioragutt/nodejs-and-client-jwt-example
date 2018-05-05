import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page.component';
import { AnonymousGuard } from './guards';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent, canActivate: [AnonymousGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
