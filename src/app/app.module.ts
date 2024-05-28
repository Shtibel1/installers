import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { CdkColumnDef } from '@angular/cdk/table';
import { DatePipe } from '@angular/common';
import {
  HttpClientModule,
  HttpClientJsonpModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCommonModule,
  MatNativeDateModule,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatPaginatorModule,
  MatPaginatorIntl,
} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { NgxMaskModule } from 'ngx-mask';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AssignmentsComponent } from './components/assignments/assignments.component';
import { AssignmentAdditionalsComponent } from './components/assignments/manage-assignment/assignment-additionals/assignment-additionals.component';
import { ManageAssignmentComponent } from './components/assignments/manage-assignment/manage-assignment.component';
import { ManageCommentsComponent } from './components/assignments/manage-assignment/manage-comments/manage-comments.component';
import { ManageCustomerComponent } from './components/assignments/manage-assignment/manage-customer/manage-customer.component';
import { AuthComponent } from './components/auth/auth.component';
import { BaseComponent } from './components/common/base/base.component';
import { CreateInstallerComponent } from './components/installers/create-installer/create-installer.component';
import { InstallerDetailsComponent } from './components/installers/installer-details/installer-details.component';
import { InstallerPricesComponent } from './components/installers/installer-prices/installer-prices.component';
import { InstallersComponent } from './components/installers/installers.component';
import { MarketersComponent } from './components/marketers/marketers.component';
import { ManageProductComponent } from './components/products/manage-product/manage-product.component';
import { ProductsComponent } from './components/products/products.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { CustomMatPaginatorIntl } from './core/common/hebrew-paginator';
import { AuthInterceptorService } from './core/interceptors/auth-interceptor.service';
import { AddressComponent } from './shared/address/address.component';
import { AdressInputComponent } from './shared/adress-input/adress-input.component';
import { AutocompleteComponent } from './shared/autocomplete/autocomplete.component';
import { CheckboxComponent } from './shared/checkbox/checkbox.component';
import { DateInputComponent } from './shared/date-input/date-input.component';
import { InputComponent } from './shared/input/input.component';
import { SelectComponent } from './shared/select/select.component';
import { TableComponent } from './shared/table/table.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    AssignmentsComponent,
    ManageAssignmentComponent,
    CreateInstallerComponent,
    ManageProductComponent,
    ProductsComponent,
    InstallersComponent,
    InstallerPricesComponent,
    AuthComponent,
    InstallerDetailsComponent,
    BaseComponent,
    ManageCustomerComponent,
    ManageCommentsComponent,
    InputComponent,
    DateInputComponent,
    SelectComponent,
    AutocompleteComponent,
    AdressInputComponent,
    CheckboxComponent,
    AssignmentAdditionalsComponent,
    AddressComponent,
    MarketersComponent,
    TableComponent,
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
    HttpClientJsonpModule,
    NgxMaskModule.forRoot(),
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
    DatePipe,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
