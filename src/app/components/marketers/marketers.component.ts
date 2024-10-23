import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Marketer } from 'src/app/core/models/marketer.model';
import { ColumnsConfig } from '../installers/installersConfig';
import { ManageMarketerComponent } from './manage-marketer/manage-marketer.component';
import { FiltersService } from '../filters-bar/filters-service.service';
import { MarketersConfig } from './marketers.config';

@Component({
  selector: 'app-marketers',
  templateUrl: './marketers.component.html',
  styleUrls: ['./marketers.component.scss'],
  providers: [FiltersService],
})
export class MarketersComponent implements OnInit {
  marketers: Marketer[];
  columnConfig = MarketersConfig;
  dataSource: MatTableDataSource<Marketer>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private marketersService: MarketersService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.marketersService.getMarketers().subscribe((marketers) => {
      this.marketers = marketers;
      this.dataSource = new MatTableDataSource(marketers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  onAdd() {
    this.dialog.open(ManageMarketerComponent);
  }

  onRow(p: Marketer) {
    this.dialog.open(ManageMarketerComponent, { data: p });
  }
}
