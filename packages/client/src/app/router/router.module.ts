import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DEFAULT_ROUTER_FEATURENAME, RouterStateSerializer } from '@ngrx/router-store';

import { reducer, CustomSerializer } from './router.reducer';
import { RouterEffects } from './router.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(DEFAULT_ROUTER_FEATURENAME, reducer),
    EffectsModule.forFeature([RouterEffects]),
  ],
  providers: [{ provide: RouterStateSerializer, useClass: CustomSerializer }],
})
export class NgrxRouterModule {}
