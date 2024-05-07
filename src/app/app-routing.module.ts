import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AssignmentsComponent } from './components/assignments/assignments.component';
import { ManageAssignmentComponent } from './components/assignments/manage-assignment/manage-assignment.component';
import { CreateInstallerComponent } from './components/installers/create-installer/create-installer.component';
import { ProductsComponent } from './components/products/products.component';
import { InstallersComponent } from './components/installers/installers.component';
import { InstallerPricesComponent } from './components/installers/installer-prices/installer-prices.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthGuard } from './core/guards/auth.guard';
import { InstallerDetailsComponent } from './components/installers/installer-details/installer-details.component';
import { AssignmentResolver } from './components/assignments/manage-assignment/assignment.resolver';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: AssignmentsComponent },
      {
        path: 'manage-assignment',
        component: ManageAssignmentComponent,
        resolve: { assigment: AssignmentResolver },
      },
      {
        path: 'manage-assignment/:id',
        component: ManageAssignmentComponent,
        resolve: { assigment: AssignmentResolver },
      },
      {
        path: 'installers',
        component: InstallersComponent,
        children: [
          { path: 'create-installer', component: CreateInstallerComponent },
        ],
      },
      {
        path: 'installers/:id',
        children: [
          { path: '', component: InstallerDetailsComponent },
          { path: 'prices', component: InstallerPricesComponent },
        ],
      },
      { path: 'products', component: ProductsComponent },
    ],
  },
  { path: 'auth', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
