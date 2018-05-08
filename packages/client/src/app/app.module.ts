import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { StoreModule, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { AuthModule, selectAuthState, AuthData, AUTH_DATA_STORAGE_KEY } from '@app/auth';
import { LobbiesModule } from '@app/lobbies';
import { NgrxRouterModule } from '@app/router';
import { CoreModule } from '@app/core';
import { WebsocketModule } from '@app/websocket';

import { saveToStorage } from '@app/shared/storage';
import { environment } from '@env/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { omit } from 'lodash';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    LobbiesModule,
    WebsocketModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule,
    NgrxRouterModule,
    AuthModule,
    StoreDevtoolsModule.instrument(),
    AppRoutingModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(store: Store<any>) {
    store.select<any>(selectAuthState).subscribe((authData: AuthData) => {
      console.log('saving auth data to storage', omit(authData, ['error']));
      saveToStorage(AUTH_DATA_STORAGE_KEY, authData);
    });
  }
}
