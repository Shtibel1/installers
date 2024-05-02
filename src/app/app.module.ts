import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MAT_DATE_LOCALE, MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { CustomMatPaginatorIntl } from './core/common/hebrew-paginator';
import { LayoutModule } from '@angular/cdk/layout';
import { AssignmentsComponent } from './components/assignments/assignments.component';
import { AppRoutingModule } from './app-routing.module';
import { ManageAssignmentComponent } from './components/assignments/manage-assignment/manage-assignment.component';
import { CreateInstallerComponent } from './components/installers/create-installer/create-installer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PhoneInputComponent } from './components/common/phone-input/phone-input.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ManageProductComponent } from './components/products/manage-product/manage-product.component';
import { ProductsComponent } from './components/products/products.component';
import { InstallersComponent } from './components/installers/installers.component';
import { InstallerPricesComponent } from './components/installers/installer-prices/installer-prices.component';
import { CdkColumnDef } from '@angular/cdk/table';
import { AuthComponent } from './components/auth/auth.component';
import { AuthInterceptorService } from './core/interceptors/auth-interceptor.service';
import { InstallerDetailsComponent } from './components/installers/installer-details/installer-details.component';
import { BaseComponent } from './components/common/base/base.component';
import { ManageCustomerComponent } from './components/assignments/manage-assignment/manage-customer/manage-customer.component';
import { ManageCommentsComponent } from './components/assignments/manage-assignment/manage-comments/manage-comments.component';

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    AssignmentsComponent,
    ManageAssignmentComponent,
    CreateInstallerComponent,
    PhoneInputComponent,
    ManageProductComponent,
    ProductsComponent,
    InstallersComponent,
    InstallerPricesComponent,
    AuthComponent,
    InstallerDetailsComponent,
    BaseComponent,
    ManageCustomerComponent,
    ManageCommentsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatCommonModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    HttpClientModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatChipsModule,
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl,
    },
    CdkColumnDef,
    { provide: MAT_DIALOG_DATA, useValue: null },
    { provide: MatDialogRef, useValue: {} },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'israel' },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
