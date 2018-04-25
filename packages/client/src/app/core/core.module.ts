import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '@core/auth.service';
import { WebsocketService } from '@core/websocket.service';

@NgModule({
  imports: [
    CommonModule,
  ],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        AuthService,
        WebsocketService,
      ],
    };
  }
}
