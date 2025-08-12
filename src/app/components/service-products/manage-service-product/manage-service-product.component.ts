import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceProductVm, ServiceSuppliesService } from 'src/app/core/services/service-products.service';

@Component({
  selector: 'app-manage-service-product',
  templateUrl: './manage-service-product.component.html',
  styleUrls: ['./manage-service-product.component.scss'],
})
export class ManageServiceProductComponent implements OnInit {
  form: FormGroup;
  name: FormControl;
  errMessage: string = null;
  isEdit: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public editServiceProduct: ServiceProductVm = null,
    private serviceSuppliesService: ServiceSuppliesService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ManageServiceProductComponent>
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.editServiceProduct;
    this.initForm();
  }

  initForm() {
    const name = this.editServiceProduct?.name || '';

    this.name = new FormControl(name, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100)
    ]);

    this.form = new FormGroup({
      name: this.name,
    });
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const serviceProduct: ServiceProductVm = {
      id: this.editServiceProduct?.id || '',
      name: this.name.value.trim(),
    };

    if (this.isEdit) {
      this.serviceSuppliesService.updateServiceProduct(serviceProduct).subscribe({
        next: () => {
          this._snackBar.open('שירות עודכן בהצלחה', 'סגור', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.errMessage = error;
        }
      });
    } else {
      this.serviceSuppliesService.addServiceProduct(serviceProduct).subscribe({
        next: () => {
          this._snackBar.open('שירות נוסף בהצלחה', 'סגור', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.errMessage = error;
        }
      });
    }
  }

  onDelete() {
    if (!this.isEdit || !this.editServiceProduct) return;

    if (confirm('האם אתה בטוח שברצונך למחוק שירות זה?')) {
      this.serviceSuppliesService.deleteServiceProduct(this.editServiceProduct.id).subscribe({
        next: () => {
          this._snackBar.open('שירות נמחק בהצלחה', 'סגור', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.errMessage = error;
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  get title(): string {
    return this.isEdit ? 'עריכת שירות' : 'הוספת שירות חדש';
  }
}
