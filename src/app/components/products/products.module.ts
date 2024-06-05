import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ShtibelModule } from 'src/app/core/modules/shtibel.module';
import { ManageProductComponent } from './manage-product/manage-product.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
  },
];

@NgModule({
  declarations: [ProductsComponent, ManageProductComponent],
  imports: [CommonModule, ShtibelModule, RouterModule.forChild(routes)],
})
export class ProductsModule {}
