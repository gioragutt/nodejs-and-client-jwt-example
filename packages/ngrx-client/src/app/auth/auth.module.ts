import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '@app/shared';

import { reducer, AuthEffects } from './store';
import { AuthService } from './auth.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forFeature('auth', reducer),
    EffectsModule.forFeature([AuthEffects])
  ],
  declarations: []
})
export class AuthModule {
  static forRoot = (): ModuleWithProviders => ({
    ngModule: AuthModule,
    providers: [
      AuthService,
    ]
  })
}
