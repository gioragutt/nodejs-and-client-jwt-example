import { Component } from '@angular/core';
import { WebsocketService } from '@core/websocket.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  constructor(public ws: WebsocketService) {
  }

}
