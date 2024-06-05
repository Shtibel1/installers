import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Marketer } from 'src/app/core/models/marketer.model';
import { MarketersService } from 'src/app/core/services/marketers.service';

@Component({
  selector: 'app-manage-marketer',
  templateUrl: './manage-marketer.component.html',
  styleUrl: './manage-marketer.component.scss',
})
export class ManageMarketerComponent {
  form: FormGroup;
  name: FormControl;
  errMessage: string = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public editMarketer: Marketer = null,
    public marketersService: MarketersService,
    public _snackBar: MatSnackBar,
    public router: Router,
    public dialogRef: MatDialogRef<ManageMarketerComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    const name = this.editMarketer?.name || null;

    this.name = new FormControl(name, Validators.required);

    this.form = new FormGroup({
      name: this.name,
    });
  }

  onSubmit() {
    let marketer: Marketer = {
      id: null,
      name: this.name.value,
    };
    if (!this.editMarketer) {
      this.marketersService.createMarketer(marketer).subscribe({
        next: () => {
          this.openSnackbar('המשווק נוסף בהצלחה!');
          this.router.navigate(['/Marketers']);
          this.dialogRef.close();
        },
        error: (msg) => {
          this.errMessage = msg;
        },
      });
    } else {
      marketer.id = this.editMarketer.id;
      this.marketersService
        .updateMarketer(this.editMarketer.id, marketer)
        .subscribe({
          next: (res) => {
            this.openSnackbar('המשווק עודכן בהצלחה!');
            this.dialogRef.close();
          },
          error: (msg) => {
            this.errMessage = msg;
          },
        });
    }
  }

  onDelete() {
    if (this.editMarketer) {
      this.marketersService.deleteMarketer(this.editMarketer.id).subscribe({
        next: (res) => {
          this.openSnackbar('המוצר נמחק בהצלחה!');
          this.router.navigate(['/Marketers']);
          this.dialogRef.close();
        },
        error: (msg) => {
          this.errMessage = msg;
        },
      });
    }
  }

  openSnackbar(msg: string) {
    this._snackBar.open(msg, 'Ok', { duration: 4000 });
  }
}
