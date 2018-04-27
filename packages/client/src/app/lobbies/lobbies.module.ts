import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared';
import { LobbyItemComponent } from '@app/lobbies/lobby-item/lobby-item.component';
import { LobbiesComponent } from '@app/lobbies/lobbies.component';
import { LobbyEventsListComponent } from './lobby-events-list/lobby-events-list.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
  ],
  declarations: [
    LobbiesComponent,
    LobbyItemComponent,
    LobbyEventsListComponent,
  ],
})
export class LobbiesModule { }
