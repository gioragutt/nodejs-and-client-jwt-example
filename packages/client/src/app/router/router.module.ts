import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { DEFAULT_ROUTER_FEATURENAME, RouterStateSerializer } from '@ngrx/router-store';

import { reducer, CustomSerializer } from './router.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(DEFAULT_ROUTER_FEATURENAME, reducer),
  ],
  providers: [{ provide: RouterStateSerializer, useClass: CustomSerializer }],
})
export class NgrxRouterModule {}
