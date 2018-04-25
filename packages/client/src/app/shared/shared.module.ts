import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

@NgModule({
  exports: [
    MaterialModule,
    BrowserAnimationsModule,
    BrowserModule,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
  ],
  declarations: [],
})
export class SharedModule { }
