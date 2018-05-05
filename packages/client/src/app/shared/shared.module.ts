import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { TextInputComponent } from './text-input/text-input.component';

@NgModule({
  exports: [
    MaterialModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    VirtualScrollModule,
    TextInputComponent,
  ],
  imports: [BrowserModule, MaterialModule, FormsModule],
  declarations: [TextInputComponent],
})
export class SharedModule {}
