import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MyErrorStateMatcher } from 'src/app/core/common/error-matcher';
import { Category } from 'src/app/core/models/category.model';
import { InstallerDto as ServiceProviderDto } from 'src/app/core/models/installer.model';
import { ManagerDto } from 'src/app/core/models/manager.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CategoriesService } from 'src/app/core/services/categories.service';

@Component({
  selector: 'app-create-installer',
  templateUrl: './create-installer.component.html',
  styleUrls: ['./create-installer.component.scss'],
})
export class CreateInstallerComponent implements OnInit {
  form: FormGroup;
  phone: FormControl;
  name: FormControl;
  email: FormControl;
  matcher = new MyErrorStateMatcher();
  errMessage: string | null = null;
  hidePassword = true;
  categories: Category[];
  category = new FormControl(null, Validators.required);

  constructor(
    @Inject(MAT_DIALOG_DATA) public installerMode: boolean,
    public accountsService: AuthService,
    public categoriesService: CategoriesService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateInstallerComponent>
  ) {}

  ngOnInit(): void {
    this.forminit();
    if (this.installerMode) {
      this.categoriesInit();
    }
  }

  forminit() {
    this.name = new FormControl(null, Validators.required);
    this.phone = new FormControl(null, Validators.required);
    this.email = new FormControl();

    this.form = new FormGroup({
      name: this.name,
      phone: this.phone,
      email: this.email,
      categories: this.category,
      password: new FormControl(null, Validators.required),
    });
  }

  onSubmit() {
    if (this.installerMode) {
      let categoryIds: string[] = [];
      this.categories.forEach((cat) => {
        this.form.value.categories.forEach((formCat) => {
          if (cat.name == formCat) {
            categoryIds.push(cat.id);
          }
        });
      });
      let serviceProvider: ServiceProviderDto = {
        name: this.name.value,
        phone: this.phone.value,
        email: this.email.value,
        role: 'installer',
        categories: categoryIds,
      };
      this.accountsService
        .createServiceProvider(serviceProvider, this.form.value.password)
        .subscribe({
          next: (res) => {
            this.openSnackBar('מתקין נוסף בהצלחה!');
            this.dialogRef.close();
          },
          error: (msg) => {
            this.errMessage = msg;
          },
        });
    } else {
      let manager: ManagerDto = { ...this.form.value };
      this.accountsService
        .createManager(manager, this.form.value.password)
        .subscribe({
          next: (res) => {
            this.openSnackBar('משתמש נוסף בהצלחה!');
            this.dialogRef.close();
          },
          error: (msg) => {
            this.errMessage = msg;
          },
        });
    }
  }

  private openSnackBar(message: string) {
    this._snackBar.open(message, 'Ok', {
      duration: 5000,
    });
  }

  categoriesInit() {
    this.categoriesService.categoriesChain.subscribe((res) => {
      if (!res) {
        this.categoriesService.getCategories().subscribe();
      } else {
        this.categories = res;
      }
    });
  }
}
