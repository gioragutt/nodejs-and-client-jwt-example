import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from '@app/app.component';
import { AuthModule } from '@app/auth';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

import { AppRoutes } from './app.routes';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LobbiesModule } from '@app/lobbies';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    SharedModule,
    AuthModule,
    AppRoutes,
    LobbiesModule,
    CoreModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
