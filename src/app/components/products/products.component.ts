import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from 'src/app/core/models/product.model';
import { ProductsService } from 'src/app/core/services/products.service';
import { ColumnsConfig } from './columnsConfig';
import { ManageProductComponent } from './manage-product/manage-product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: Product[];
  columnConfig = ColumnsConfig;
  dataSource: MatTableDataSource<Product>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private productsService: ProductsService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.productsService.products$.subscribe((products) => {
      if (!products) {
        this.productsService.getProducts().subscribe();
      } else {
        this.products = products;
        this.dataSource = new MatTableDataSource(products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }
  onAddProduct() {
    this.dialog.open(ManageProductComponent);
  }

  onProduct(p: Product) {
    this.dialog.open(ManageProductComponent, { data: p });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
