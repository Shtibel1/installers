import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AssignmentsComponent } from './assignments.component';
import { AssignmentAdditionalsComponent } from './manage-assignment/assignment-additionals/assignment-additionals.component';
import { ManageAssignmentComponent } from './manage-assignment/manage-assignment.component';
import { ManageCommentsComponent } from './manage-assignment/manage-comments/manage-comments.component';
import { ManageCustomerComponent } from './manage-assignment/manage-customer/manage-customer.component';
import { AssignmentResolver } from './manage-assignment/assignment.resolver';
import { ShtibelModule } from 'src/app/core/modules/shtibel.module';
import { SelectServiceProviderComponent } from './manage-assignment/selects/select-service-provider/select-service-provider.component';
import { SelectMarketerComponent } from './manage-assignment/selects/select-marketer/select-marketer.component';
import { SelectProductComponent } from './manage-assignment/selects/select-product/select-product.component';
import { SelectStatusComponent } from './manage-assignment/selects/select-status/select-status.component';
import { SelectPickupStatusComponent } from './manage-assignment/selects/pickup-status/select-pickup-status.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const routes: Routes = [
  {
    path: '',
    component: AssignmentsComponent,
  },

  {
    path: 'manage',
    component: ManageAssignmentComponent,
  },

  {
    path: 'manage/:id',
    component: ManageAssignmentComponent,
    resolve: { assigment: AssignmentResolver },
  },
];

@NgModule({
  declarations: [
    AssignmentsComponent,
    AssignmentAdditionalsComponent,
    ManageAssignmentComponent,
    ManageCustomerComponent,
    ManageCommentsComponent,
    SelectServiceProviderComponent,
    SelectMarketerComponent,
    SelectProductComponent,
    SelectStatusComponent,
    SelectPickupStatusComponent,
  ],
  imports: [
    CommonModule,
    ShtibelModule,
    RouterModule.forChild(routes),
    MatProgressSpinnerModule,
  ],
})
export class AssignmentsModule {}
