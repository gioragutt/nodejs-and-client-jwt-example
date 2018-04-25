import { Component } from '@angular/core';
import { WebsocketService } from '@core/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(ws: WebsocketService) {}
}
