import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InstallerDetailsComponent } from './installer-details/installer-details.component';
import { InstallerPricesComponent } from './installer-prices/installer-prices.component';
import { InstallersComponent } from './installers.component';
import { CreateInstallerComponent } from './create-installer/create-installer.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ShtibelModule } from 'src/app/core/modules/shtibel.module';
import { ManageInstallerComponent } from './installer-details/manage-installer/manage-installer.component';

const routes: Routes = [
  {
    path: '',
    component: InstallersComponent,
  },
  {
    path: 'details/:id',
    children: [
      { path: '', component: InstallerDetailsComponent },
      { path: 'prices', component: InstallerPricesComponent },
    ],
  },
];

@NgModule({
  declarations: [
    InstallersComponent,
    InstallerPricesComponent,
    InstallerDetailsComponent,
    CreateInstallerComponent,
    ManageInstallerComponent,
  ],
  imports: [CommonModule, ShtibelModule, RouterModule.forChild(routes)],
})
export class InstallersModule {}
