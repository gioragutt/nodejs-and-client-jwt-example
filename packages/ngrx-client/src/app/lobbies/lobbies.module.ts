import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LobbiesHomeComponent } from './lobbies-home/lobbies-home.component';
import { LobbiesRoutingModule } from './lobbies-routing.module';
import { SharedModule } from '@app/shared';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LobbiesRoutingModule,
  ],
  declarations: [
    LobbiesHomeComponent,
  ]
})
export class LobbiesModule { }
