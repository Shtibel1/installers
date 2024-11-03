import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import { Category } from 'src/app/core/models/category.model';
import { CategoriesService } from 'src/app/core/services/categories.service';

@Component({
  selector: 'app-manage-category',

  templateUrl: './manage-category.component.html',
  styleUrl: './manage-category.component.scss',
})
export class ManageCategoryComponent {
  form: FormGroup;
  name: FormControl;
  errMessage: string = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public editCategory: Category = null,
    public categoriesService: CategoriesService,
    public _snackBar: MatSnackBar,
    public router: Router,
    public dialogRef: MatDialogRef<ManageCategoryComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    const name = this.editCategory?.name || null;

    this.name = new FormControl(name, Validators.required);

    this.form = new FormGroup({
      name: this.name,
    });
  }

  onSubmit() {
    let Category: Category = {
      id: null,
      name: this.name.value,
    };
    if (!this.editCategory) {
      this.categoriesService.createCategory(Category).subscribe({
        next: () => {
          this.openSnackbar('הקטגוריה נוספה בהצלחה!');
          this.router.navigate(['/categories']);
          this.dialogRef.close();
        },
        error: (msg) => {
          this.errMessage = msg;
        },
      });
    } else {
      Category.id = this.editCategory.id;
      this.categoriesService
        .updateCategory(this.editCategory.id, Category)
        .subscribe({
          next: (res) => {
            this.openSnackbar('הקטגוריה עודכנה בהצלחה!');
            this.dialogRef.close();
          },
          error: (msg) => {
            this.errMessage = msg;
          },
        });
    }
  }

  onDelete() {
    if (this.editCategory) {
      this.categoriesService.deleteCategory(this.editCategory.id).subscribe({
        next: (res) => {
          this.openSnackbar('הקטגוריה נמחקה בהצלחה!');
          this.router.navigate(['/categories']);
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
