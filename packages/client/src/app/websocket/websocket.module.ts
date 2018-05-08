import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './store';
import { EffectsModule } from '@ngrx/effects';
import { WebsocketEffects } from './store';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('websocket', reducer),
    EffectsModule.forFeature([WebsocketEffects]),
  ],
  declarations: [],
})
export class WebsocketModule { }
