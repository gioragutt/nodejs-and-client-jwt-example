import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './store';
import { EffectsModule } from '@ngrx/effects';
import { WebsocketEffects } from './store';
import { WebsocketService } from './websocket.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('websocket', reducer),
    EffectsModule.forFeature([WebsocketEffects]),
  ],
  declarations: [],
})
export class WebsocketModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: WebsocketModule,
      providers: [WebsocketService],
    };
  }
}
