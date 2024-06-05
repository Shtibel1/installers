import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from 'src/app/core/models/category.model';
import { CategoriesConfig } from './categories.config';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { FiltersService } from '../filters-bar/filters-service.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  providers: [FiltersService],
})
export class CategoriesComponent {
  categories: Category[];
  columnConfig = CategoriesConfig;
  dataSource: MatTableDataSource<Category>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.dataSource = new MatTableDataSource(categories);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  onAdd() {
    this.dialog.open(ManageCategoryComponent);
  }

  onRow(p: Category) {
    this.dialog.open(ManageCategoryComponent, { data: p });
  }
}
