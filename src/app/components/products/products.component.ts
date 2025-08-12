import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from 'src/app/core/models/product.model';
import { ProductsService } from 'src/app/core/services/products.service';
import { ServiceSuppliesService, ProductRequirementVm } from 'src/app/core/services/service-products.service';
import { ColumnsConfig } from './products.config';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { FiltersService } from '../filters-bar/filters-service.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  providers: [FiltersService],
})
export class ProductsComponent implements OnInit {
  products: Product[];
  productsWithRequirements: (Product & { requirements?: ProductRequirementVm[] })[] = [];
  columnConfig = ColumnsConfig;
  dataSource: MatTableDataSource<Product>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private productsService: ProductsService,
    private serviceSuppliesService: ServiceSuppliesService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.productsService.products$.subscribe((products) => {
      if (!products) {
        this.productsService.getProducts().subscribe();
      } else {
        this.products = products;
        this.loadProductsWithRequirements(products);
      }
    });
  }

  loadProductsWithRequirements(products: Product[]) {
    // Load service products first to get names
    this.serviceSuppliesService.getServiceProducts().subscribe(() => {
      // Load requirements for each product
      const requirementObservables = products.map(product => 
        this.serviceSuppliesService.getRequirements(product.id).pipe(
          catchError(() => of([])) // Return empty array if requirements fail to load
        )
      );

      forkJoin(requirementObservables).subscribe(requirementsArray => {
        this.productsWithRequirements = products.map((product, index) => ({
          ...product,
          requirements: requirementsArray[index].map(req => ({
            ...req,
            serviceProductName: this.serviceSuppliesService.serviceProducts$.value?.find(sp => sp.id === req.serviceProductId)?.name || req.serviceProductName
          }))
        }));
        
        this.dataSource = new MatTableDataSource(this.productsWithRequirements);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cdr.detectChanges();
      });
    });
  }
  onAdd() {
    this.dialog.open(ManageProductComponent);
  }

  onProduct(p: Product) {
    this.dialog.open(ManageProductComponent, { data: p });
  }
}
