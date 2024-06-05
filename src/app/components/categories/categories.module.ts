import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShtibelModule } from 'src/app/core/modules/shtibel.module';

import { CategoriesComponent } from './categories.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
  },
];

@NgModule({
  declarations: [CategoriesComponent, ManageCategoryComponent],
  imports: [CommonModule, ShtibelModule, RouterModule.forChild(routes)],
})
export class CategoriesModule {}
