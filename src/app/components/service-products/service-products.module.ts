import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ServiceProductsComponent } from './service-products.component';
import { ShtibelModule } from 'src/app/core/modules/shtibel.module';
import { ManageServiceProductComponent } from './manage-service-product/manage-service-product.component';

const routes: Routes = [
  {
    path: '',
    component: ServiceProductsComponent,
  },
];

@NgModule({
  declarations: [ServiceProductsComponent, ManageServiceProductComponent],
  imports: [CommonModule, ShtibelModule, RouterModule.forChild(routes)],
})
export class ServiceProductsModule {}
