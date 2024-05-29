import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() dataSource: MatTableDataSource<any>;
  @Input() displayedColumns: string[];
  @Input() columns: Column[];

  constructor() {}

  ngOnInit(): void {}

  onRow(row) {}
}

export interface Column {
  ref: string;
  label: string;
  value?: string;
}
