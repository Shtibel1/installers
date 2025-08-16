import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ServiceSuppliesService, ServiceProviderStockVm, ServiceProductVm, StockAdjustmentVm } from 'src/app/core/services/service-products.service';
import { ServiceProvider } from 'src/app/core/models/serviceProvider.model';
import { ServiceProvidersService } from 'src/app/core/services/service-providers.service';
import { ManageStockComponent } from './manage-stock/manage-stock.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap, combineLatest } from 'rxjs';
import { StockAuditDialogComponent } from './stock-audit-dialog';

@Component({
  selector: 'app-provider-stock',
  templateUrl: './provider-stock.component.html',
  styleUrls: ['./provider-stock.component.scss']
})
export class ProviderStockComponent implements OnInit {
  installer: ServiceProvider;
  stockItems: ServiceProviderStockVm[] = [];
  serviceProducts: ServiceProductVm[] = [];
  dataSource = new MatTableDataSource<ServiceProviderStockVm>();
  displayedColumns: string[] = ['serviceProductName', 'amount', 'actions'];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private serviceSuppliesService: ServiceSuppliesService,
    private serviceProvidersService: ServiceProvidersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      const installerId = params['id'];
      if (installerId) {
        this.loadInstallerAndStock(installerId);
      }
    });
  }

  private loadInstallerAndStock(installerId: string): void {
    this.isLoading = true;
    
    // Use switchMap and combineLatest to handle BehaviorSubjects properly
    this.serviceProvidersService.getserviceProviders().pipe(
      switchMap(installers => {
        if (!installers) {
          throw new Error('No installers data available');
        }
        
        this.installer = installers.find(i => i.id.toString() === installerId);
        if (!this.installer) {
          throw new Error('Installer not found');
        }
        
        // Combine service products and stock data
        return combineLatest([
          this.serviceSuppliesService.getServiceProducts(),
          this.serviceSuppliesService.getProviderStock(installerId)
        ]);
      })
    ).subscribe({
      next: ([serviceProducts, stock]) => {
        this.serviceProducts = serviceProducts;
        this.stockItems = stock.map(item => ({
          ...item,
          serviceProductName: serviceProducts.find(sp => sp.id === item.serviceProductId)?.name || 'Unknown Product'
        }));
        this.dataSource.data = this.stockItems;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.snackBar.open('שגיאה בטעינת הנתונים', 'סגור', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onAddStock(): void {
    const dialogRef = this.dialog.open(ManageStockComponent, {
      data: {
        installer: this.installer,
        serviceProducts: this.serviceProducts,
        isEdit: false
      },
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adjustStock(result);
      }
    });
  }

  onEditStock(stockItem: ServiceProviderStockVm): void {
    const dialogRef = this.dialog.open(ManageStockComponent, {
      data: {
        installer: this.installer,
        serviceProducts: this.serviceProducts,
        stockItem: stockItem,
        isEdit: true
      },
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adjustStock(result);
      }
    });
  }

  private adjustStock(adjustment: StockAdjustmentVm): void {
    this.serviceSuppliesService.adjustStock(adjustment).subscribe({
      next: () => {
        this.snackBar.open('המלאי עודכן בהצלחה', 'סגור', { duration: 3000 });
        this.loadInstallerAndStock(this.installer.id.toString());
      },
      error: (error) => {
        console.error('Error adjusting stock:', error);
        this.snackBar.open('שגיאה בעדכון המלאי', 'סגור', { duration: 3000 });
      }
    });
  }

  onRemoveStock(stockItem: ServiceProviderStockVm): void {
    if (confirm('האם אתה בטוח שברצונך להסיר פריט זה מהמלאי?')) {
      const adjustment: StockAdjustmentVm = {
        serviceProviderIdExternal: this.installer.id.toString(),
        serviceProductId: stockItem.serviceProductId,
        delta: -stockItem.amount,
        reason: 'הסרת פריט מהמלאי'
      };

      this.adjustStock(adjustment);
    }
  }

    onViewAudit(stockItem: ServiceProviderStockVm): void {
      this.dialog.open(StockAuditDialogComponent, {
        data: {
          audit: stockItem.auditVm,
          productName: stockItem.serviceProductName
        },
        width: '600px'
      });
    }
}
