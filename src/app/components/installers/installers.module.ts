import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InstallerDetailsComponent } from './installer-details/installer-details.component';
import { InstallerCalculationsComponent } from './installer-details/installer-calculations/installer-calculations.component';
import { InstallerPricesComponent } from './installer-prices/installer-prices.component';
import { InstallersComponent } from './installers.component';
import { CreateInstallerComponent } from './create-installer/create-installer.component';
import { ShtibelModule } from 'src/app/core/modules/shtibel.module';
import { ManageInstallerComponent } from './installer-details/manage-installer/manage-installer.component';
import { ProviderStockComponent } from './provider-stock/provider-stock.component';
import { ManageStockComponent } from './provider-stock/manage-stock/manage-stock.component';
import { StockAuditDialogComponent } from './provider-stock/stock-audit-dialog/stock-audit-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: InstallersComponent,
  },
  {
    path: 'details/:id',
    children: [
      { path: '', component: InstallerDetailsComponent },
      { path: 'calculations', component: InstallerCalculationsComponent },
      { path: 'prices', component: InstallerPricesComponent },
      { path: 'stock', component: ProviderStockComponent },
    ],
  },
];

@NgModule({
  declarations: [
    InstallersComponent,
    InstallerPricesComponent,
    InstallerDetailsComponent,
    InstallerCalculationsComponent,
    CreateInstallerComponent,
    ManageInstallerComponent,
    ProviderStockComponent,
    ManageStockComponent,
    // Register the audit dialog component
    StockAuditDialogComponent,
  ],
  imports: [CommonModule, ShtibelModule, RouterModule.forChild(routes)],
})
export class InstallersModule {}
