import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ServiceProductVm, ServiceSuppliesService } from 'src/app/core/services/service-products.service';
import { ColumnsConfig } from './service-products.config';
import { ManageServiceProductComponent } from './manage-service-product/manage-service-product.component';
import { FiltersService } from '../filters-bar/filters-service.service';

@Component({
  selector: 'app-service-products',
  templateUrl: './service-products.component.html',
  styleUrls: ['./service-products.component.scss'],
  providers: [FiltersService],
})
export class ServiceProductsComponent implements OnInit {
  serviceProducts: ServiceProductVm[];
  columnConfig = ColumnsConfig;
  dataSource: MatTableDataSource<ServiceProductVm>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private serviceSuppliesService: ServiceSuppliesService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.serviceSuppliesService.serviceProducts$.subscribe((serviceProducts) => {
      if (!serviceProducts) {
        this.serviceSuppliesService.getServiceProducts().subscribe();
      } else {
        this.serviceProducts = serviceProducts;
        this.dataSource = new MatTableDataSource(serviceProducts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  onAdd() {
    this.dialog.open(ManageServiceProductComponent);
  }

  onServiceProduct(sp: ServiceProductVm) {
    this.dialog.open(ManageServiceProductComponent, { data: sp });
  }
}
