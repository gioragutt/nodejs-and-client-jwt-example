import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { StoreModule, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { AuthModule, getAuthState, AuthData, AUTH_DATA_STORAGE_KEY } from '@app/auth';
import { saveToStorage } from '@app/shared/storage';
import { reducers } from '@app/app.reducer';
import { environment } from '@env/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LobbiesModule } from '@app/lobbies/lobbies.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LobbiesModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule,
    AuthModule.forRoot(),
    StoreDevtoolsModule.instrument(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(store: Store<any>) {
    store.select<any>(getAuthState).subscribe((authData: AuthData) => {
      console.log('saving auth data to storage', authData);
      saveToStorage(AUTH_DATA_STORAGE_KEY, authData);
    })
  }
}
