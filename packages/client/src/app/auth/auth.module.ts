import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';

import { AuthComponent } from './auth/auth.component';
import { LoggedInGuard } from './logged-in.guard';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  imports: [
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AuthComponent,
    AuthFormComponent,
    ProfileComponent,
  ],
  exports: [
    ProfileComponent,
  ],
  providers: [
    LoggedInGuard,
  ],
})
export class AuthModule { }
