import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '@app/home/home.component';
import { SharedModule } from '@app/shared';
import { LobbiesListComponent } from './lobbies-list/lobbies-list.component';
import { LobbyItemComponent } from './lobby-item/lobby-item.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    HomeComponent,
    LobbiesListComponent,
    LobbyItemComponent,
  ],
})
export class HomeModule { }
