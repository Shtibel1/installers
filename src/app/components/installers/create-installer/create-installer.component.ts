import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { Category } from 'src/app/core/models/category.model';
import { Installer, InstallerDto } from 'src/app/core/models/installer.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Manager, ManagerDto } from 'src/app/core/models/manager.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppUser } from 'src/app/core/models/app-user.model';
import { MyErrorStateMatcher } from 'src/app/core/common/error-matcher';

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
      let categories: number[] = [];
      this.categories.forEach((cat) => {
        this.form.value.categories.forEach((formCat) => {
          if (cat.name == formCat) {
            categories.push(cat.id);
          }
        });
      });
      let installer: InstallerDto = {
        name: this.name.value,
        phone: this.phone.value,
        email: this.email.value,
        role: 'installer',
        categories: categories,
      };
      this.accountsService
        .createInstaller(installer, this.form.value.password)
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
