import { NgModule } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { AuthModule } from '@app/auth';
import { AppRoutes } from './app.routes';
import { CoreModule } from '@app/core';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    SharedModule,
    AuthModule,
    AppRoutes,
    CoreModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
