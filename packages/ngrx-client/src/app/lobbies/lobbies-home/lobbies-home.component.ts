import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lobbies-home',
  templateUrl: './lobbies-home.component.html',
  styleUrls: ['./lobbies-home.component.scss'],
  host: {
    class: 'routed-component'
  },
})
export class LobbiesHomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
