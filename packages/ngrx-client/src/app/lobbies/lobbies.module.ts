import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LobbiesHomeComponent } from './lobbies-home/lobbies-home.component';
import { LobbiesRoutingModule } from './lobbies-routing.module';

@NgModule({
  imports: [
    CommonModule,
    LobbiesRoutingModule,
  ],
  declarations: [
    LobbiesHomeComponent,
  ]
})
export class LobbiesModule { }
