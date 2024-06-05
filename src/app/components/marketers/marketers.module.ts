import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShtibelModule } from 'src/app/core/modules/shtibel.module';
import { MarketersComponent } from './marketers.component';
import { ManageMarketerComponent } from './manage-marketer/manage-marketer.component';

const routes: Routes = [
  {
    path: '',
    component: MarketersComponent,
  },
];

@NgModule({
  declarations: [ManageMarketerComponent, MarketersComponent],
  imports: [CommonModule, ShtibelModule, RouterModule.forChild(routes)],
})
export class MarketersModule {}
