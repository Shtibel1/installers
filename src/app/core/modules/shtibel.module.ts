import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthComponent } from 'src/app/components/auth/auth.component';
import { FiltersBarComponent } from 'src/app/components/filters-bar/filters-bar.component';
import { AddressComponent } from 'src/app/shared/address/address.component';
import { AdressInputComponent } from 'src/app/shared/adress-input/adress-input.component';
import { AutocompleteComponent } from 'src/app/shared/autocomplete/autocomplete.component';
import { CheckboxComponent } from 'src/app/shared/checkbox/checkbox.component';
import { DateInputComponent } from 'src/app/shared/date-input/date-input.component';
import { InputComponent } from 'src/app/shared/input/input.component';
import { SelectComponent } from 'src/app/shared/select/select.component';
import { TableComponent } from 'src/app/shared/table/table.component';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { SelectCategoriesComponent } from 'src/app/shared/select-categories/select-categories.component';

@NgModule({
  declarations: [
    InputComponent,
    DateInputComponent,
    SelectComponent,
    AutocompleteComponent,
    AdressInputComponent,
    CheckboxComponent,
    AddressComponent,
    TableComponent,
    FiltersBarComponent,
    SelectCategoriesComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
  ],
  exports: [
    InputComponent,
    DateInputComponent,
    SelectComponent,
    AutocompleteComponent,
    AdressInputComponent,
    CheckboxComponent,
    AddressComponent,
    TableComponent,
    FiltersBarComponent,
    MaterialModule,
    ReactiveFormsModule,
    SelectCategoriesComponent,
  ],
})
export class ShtibelModule {}
