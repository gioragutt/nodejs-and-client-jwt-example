import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from '@app/app.component';
import { AuthModule } from '@app/auth';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { HomeModule } from '@app/home';

import { AppRoutes } from './app.routes';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
  ],
  imports: [
    SharedModule,
    AuthModule,
    AppRoutes,
    HomeModule,
    CoreModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
