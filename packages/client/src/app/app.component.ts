import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app">
      <app-toolbar></app-toolbar>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  `],
})
export class AppComponent {}
