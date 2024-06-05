import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MyErrorStateMatcher } from 'src/app/core/common/error-matcher';
import { Category } from 'src/app/core/models/category.model';
import { InstallerDto as ServiceProviderDto } from 'src/app/core/models/installer.model';
import { Option } from 'src/app/core/models/option.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-create-installer',
  templateUrl: './create-installer.component.html',
  styleUrls: ['./create-installer.component.scss'],
})
export class CreateInstallerComponent implements OnInit {
  form: FormGroup;
  phone: FormControl<string | null>;
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  category: FormControl<Option<Category>[] | null>;

  matcher = new MyErrorStateMatcher();
  errMessage: string | null = null;
  hidePassword = true;

  constructor(
    public accountsService: AuthService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateInstallerComponent>
  ) {}

  ngOnInit(): void {
    this.forminit();
  }

  forminit() {
    this.name = new FormControl(null, Validators.required);
    this.phone = new FormControl(null, Validators.required);
    this.email = new FormControl();
    this.password = new FormControl(null, Validators.required);

    this.category = new FormControl(null, Validators.required);

    this.form = new FormGroup({
      name: this.name,
      phone: this.phone,
      email: this.email,
      categories: this.category,
      password: this.password,
    });
  }

  onSubmit() {
    let categoryIds: string[] = this.category.value.map((cat) => cat.value.id);

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
  }

  private openSnackBar(message: string) {
    this._snackBar.open(message, 'Ok', {
      duration: 5000,
    });
  }
}
