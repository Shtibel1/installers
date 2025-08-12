import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceProductVm, ServiceProviderStockVm, StockAdjustmentVm } from 'src/app/core/services/service-products.service';
import { ServiceProvider } from 'src/app/core/models/serviceProvider.model';

interface DialogData {
  installer: ServiceProvider;
  serviceProducts: ServiceProductVm[];
  stockItem?: ServiceProviderStockVm;
  isEdit: boolean;
}

@Component({
  selector: 'app-manage-stock',
  templateUrl: './manage-stock.component.html',
  styleUrls: ['./manage-stock.component.scss']
})
export class ManageStockComponent implements OnInit {
  stockForm: FormGroup;
  adjustmentTypes = [
    { value: 'add', label: 'הוספה למלאי', icon: 'add', symbol: '+' },
    { value: 'remove', label: 'הוצאה מהמלאי', icon: 'remove', symbol: '−' },
    { value: 'set', label: 'קביעת כמות', icon: 'edit', symbol: '=' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ManageStockComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.stockForm = this.fb.group({
      serviceProductId: ['', Validators.required],
      adjustmentType: ['add', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      reason: ['']
    });
  }

  ngOnInit(): void {
    if (this.data.isEdit && this.data.stockItem) {
      this.stockForm.patchValue({
        serviceProductId: this.data.stockItem.serviceProductId,
        adjustmentType: 'set',
        amount: this.data.stockItem.amount
      });
    }
  }

  get title(): string {
    return this.data.isEdit ? 'עדכון מלאי' : 'הוספה למלאי';
  }

  get currentStock(): number {
    if (!this.data.isEdit || !this.data.stockItem) return 0;
    return this.data.stockItem.amount;
  }

  onSubmit(): void {
    if (this.stockForm.valid) {
      const formValue = this.stockForm.value;
      let delta = 0;

      switch (formValue.adjustmentType) {
        case 'add':
          delta = formValue.amount;
          break;
        case 'remove':
          delta = -formValue.amount;
          break;
        case 'set':
          delta = formValue.amount - this.currentStock;
          break;
      }

      const adjustment: StockAdjustmentVm = {
        serviceProviderIdExternal: this.data.installer.id.toString(),
        serviceProductId: formValue.serviceProductId,
        delta: delta,
        reason: formValue.reason || this.getDefaultReason(formValue.adjustmentType)
      };

      this.dialogRef.close(adjustment);
    }
  }

  private getDefaultReason(adjustmentType: string): string {
    switch (adjustmentType) {
      case 'add':
        return 'הוספה למלאי';
      case 'remove':
        return 'הוצאה מהמלאי';
      case 'set':
        return 'עדכון כמות במלאי';
      default:
        return 'עדכון מלאי';
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getAdjustmentTypeIcon(type: string): string {
    const adjustmentType = this.adjustmentTypes.find(t => t.value === type);
    return adjustmentType?.icon || 'edit';
  }

  getAmountPlaceholder(): string {
    const adjustmentType = this.stockForm.get('adjustmentType')?.value;
    switch (adjustmentType) {
      case 'add':
        return 'כמות להוספה';
      case 'remove':
        return 'כמות להוצאה';
      case 'set':
        return 'כמות חדשה במלאי';
      default:
        return 'הזן כמות';
    }
  }

  getNewAmount(): number {
    if (!this.data.isEdit || !this.stockForm.valid) return 0;
    
    const formValue = this.stockForm.value;
    const currentStock = this.currentStock;
    
    switch (formValue.adjustmentType) {
      case 'add':
        return currentStock + formValue.amount;
      case 'remove':
        return currentStock - formValue.amount;
      case 'set':
        return formValue.amount;
      default:
        return currentStock;
    }
  }
}
