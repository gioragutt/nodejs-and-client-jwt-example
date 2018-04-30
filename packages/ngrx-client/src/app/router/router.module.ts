import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './router.reducer'
import { DEFAULT_ROUTER_FEATURENAME } from '@ngrx/router-store'

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(DEFAULT_ROUTER_FEATURENAME, reducer),
  ],
  declarations: []
})
export class RouterModule { }
