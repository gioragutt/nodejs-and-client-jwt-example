import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { LobbiesHomeDataSource } from './lobbies-home-datasource';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-lobbies-home',
  templateUrl: './lobbies-home.component.html',
  styleUrls: ['./lobbies-home.component.scss'],
})
export class LobbiesHomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: LobbiesHomeDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'owner', 'connectedUsers', 'actions'];

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.dataSource = new LobbiesHomeDataSource(this.paginator, this.sort, this.store);
  }
}
