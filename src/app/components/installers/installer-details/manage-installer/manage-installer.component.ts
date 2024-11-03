import { EmployeesService } from './../../../../core/services/employees.service';
import { ServiceProvider } from 'src/app/core/models/serviceProvider.model';
import { Component, Inject, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManageCategoryComponent } from 'src/app/components/categories/manage-category/manage-category.component';
import { Category } from 'src/app/core/models/category.model';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { ServiceProvidersService } from 'src/app/core/services/service-providers.service';
import { Router } from '@angular/router';
import { Option } from 'src/app/core/models/option.model';

@Component({
  selector: 'app-manage-installer',
  templateUrl: './manage-installer.component.html',
  styleUrl: './manage-installer.component.scss',
})
export class ManageInstallerComponent {
  categories: FormControl<Option<Category>[] | null>;

  form: FormGroup;
  errMessage: string = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public editServiceProvider: ServiceProvider = null,
    public serviceProviderService: ServiceProvidersService,
    public _snackBar: MatSnackBar,
    public router: Router,
    public dialogRef: MatDialogRef<ManageCategoryComponent>,
    public categoriesService: CategoriesService,
    public employeesService: EmployeesService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    const catOpts =
      this.editServiceProvider.categories?.map((cat) => {
        return { label: cat.name, value: cat };
      }) || null;

    this.categories = new FormControl(catOpts, Validators.required);

    this.form = new FormGroup({
      categories: this.categories,
    });
  }

  onSubmit() {
    let categories: Category[] = this.categories.value.map((cat) => cat.value);

    this.employeesService
      .AddCategoriesToServiceProvider(categories, this.editServiceProvider.id)
      .subscribe({
        next: () => {
          this.openSnackbar('הקטגוריות עודכנו בהצלחה');
          this.dialogRef.close();
        },
        error: (msg) => {
          this.errMessage = msg;
        },
      });
  }

  openSnackbar(msg: string) {
    this._snackBar.open(msg, 'Ok', { duration: 4000 });
  }
}
