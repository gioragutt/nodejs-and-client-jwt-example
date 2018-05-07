import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map, tap, switchMap } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Lobby, selectAllLobbies } from '../store';
import { Store } from '@ngrx/store';
import { get } from 'lodash';

/**
 * Data source for the LobbiesHome view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class LobbiesHomeDataSource extends DataSource<Lobby> {
  lobbies$: Observable<Lobby[]>;

  constructor(private paginator: MatPaginator, private sort: MatSort, private store: Store<any>) {
    super();

    this.lobbies$ = this.store.select(selectAllLobbies).pipe(
      tap(lobbies => this.paginator.length = (lobbies || []).length),
    );
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Lobby[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      this.lobbies$,
      this.paginator.page,
      this.sort.sortChange,
    ];

    return merge(...dataMutations).pipe(
      switchMap(() => this.lobbies$),
      map(lobbies => this.getPagedData(this.getSortedData([...lobbies]))),
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: Lobby[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Lobby[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a: Lobby, b: Lobby) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'id': return compareAttribute('id', a, b, isAsc);
        case 'name': return compareAttribute('name', a, b, isAsc);
        case 'owner': return compareAttribute('owner', a, b, isAsc);
        case 'connectedUsers': return compareAttribute('users.length', a, b, isAsc);
        default:
          return 0;
      }
    });
  }
}

const compareAttribute = (attr, a, b, isAsc) => compare(get(a, attr), get(b, attr), isAsc);
const compare = (a, b, isAsc) => (a < b ? -1 : 1) * (isAsc ? 1 : -1);
