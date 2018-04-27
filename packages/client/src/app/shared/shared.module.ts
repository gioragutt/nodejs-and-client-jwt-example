import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  exports: [
    MaterialModule,
    BrowserModule,
    FormsModule,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
  ],
})
export class SharedModule { }
