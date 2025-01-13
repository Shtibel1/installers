import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, filter, takeUntil } from 'rxjs';
import { FiltersService } from 'src/app/components/filters-bar/filters-service.service';
import { PickupStatus } from 'src/app/core/enums/pickup-status.enum';
import { Status, StatusDescriptions } from 'src/app/core/enums/status.enum';
import { Assignment } from 'src/app/core/models/assignment.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Input() dataSource?: MatTableDataSource<any>;
  @Input() displayedColumns: string[];
  @Input() columns: Column[];
  searchText: string;

  destroyed$: Subject<void> = new Subject();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Output() isPaidChange = new EventEmitter<Assignment>();
  @Output() rowClick = new EventEmitter<any>();
  constructor(private filtersService: FiltersService) {}

  ngOnInit(): void {
    this.displayedColumns = this.columns.map((column) => column.ref);

    this.filtersService.filters$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((filters) => {
        if (filters.search) {
          this.searchText = filters.search;
          this.dataSource.filter = filters.search.trim().toLowerCase();
        } else {
          if (this?.dataSource) this.dataSource.filter = '';
        }
        if (this.dataSource?.paginator) {
          this.dataSource.paginator.firstPage();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['dataSource'] &&
      this.dataSource &&
      this.paginator &&
      this.sort
    ) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSource.filterPredicate = (data, filter: string) => {
        const accumulator = (currentTerm, key) => {
          return this.nestedFilterCheck(currentTerm, data, key);
        };
        const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
        // Transform the filter by converting it to lowercase and removing whitespace.
        const transformedFilter = filter.trim().toLowerCase();
        return dataStr.indexOf(transformedFilter) !== -1;
      };
    }
  }

  ngAfterViewInit() {
    if (!this.dataSource || !this.paginator || !this.sort) {
      return;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data, filter: string) => {
      const accumulator = (currentTerm, key) => {
        return this.nestedFilterCheck(currentTerm, data, key);
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      // Transform the filter by converting it to lowercase and removing whitespace.
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };
  }

  sortData(event: any) {
    if (event.active == 'date') {
      if (event.direction == 'asc') {
        this.dataSource.data = this.dataSource.data.sort((a, b) => {
          return (
            new Date(a.createdDate).getTime() -
            new Date(b.createdDate).getTime()
          );
        });
      }

      if (event.direction == 'desc') {
        this.dataSource.data = this.dataSource.data.sort((a, b) => {
          return (
            new Date(b.createdDate).getTime() -
            new Date(a.createdDate).getTime()
          );
        });
      }
    }
  }

  nestedFilterCheck(search, data, key) {
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    } else {
      search += data[key];
    }
    return search;
  }

  onRow(row: any) {
    this.rowClick.emit(row);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  onPaidChange(e: MatCheckboxChange, row: Assignment) {
    this.isPaidChange.emit({ ...row, isPaid: e.checked });
  }
}

export interface Column {
  ref: string;
  label: string;
  value?: (element: any) => string;
}
