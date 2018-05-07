import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '@app/shared';

import { LobbiesService } from './lobbies.service';
import { LobbiesShellComponent } from './lobbies-shell';
import { LobbiesRoutingModule } from './lobbies-routing.module';
import { reducer, LobbyEffects } from './store';
import { LobbiesListComponent } from './lobbies-list/lobbies-list.component';
import { LobbyComponent, PresentationalLobbyComponent } from './lobby/lobby.component';
import { LobbyEventComponent } from './lobby-event/lobby-event.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LobbiesRoutingModule,
    StoreModule.forFeature('lobbies', reducer),
    EffectsModule.forFeature([LobbyEffects]),
  ],
  declarations: [
    LobbiesShellComponent,
    LobbiesListComponent,
    PresentationalLobbyComponent,
    LobbyComponent,
    LobbyEventComponent,
  ],
  providers: [LobbiesService],
})
export class LobbiesModule {}
