import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent, PresentationalToolbarComponent } from './toolbar/toolbar.component';
import { SharedModule } from '@app/shared';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    PresentationalToolbarComponent,
    ToolbarComponent,
  ],
  exports: [
    ToolbarComponent,
  ]
})
export class CoreModule { }
