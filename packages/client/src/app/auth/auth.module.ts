import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '@app/shared';

import { reducer, AuthEffects } from './store';
import { AuthFormComponent } from './auth-form';
import { LoginPageComponent } from './login-page.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    StoreModule.forFeature('auth', reducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
  declarations: [AuthFormComponent, LoginPageComponent],
  exports: [AuthFormComponent, LoginPageComponent],
})
export class AuthModule { }
