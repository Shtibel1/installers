import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface StockAuditEntry {
  date: string;
  user: string;
  delta: number;
  reason: string;
  performedAt: Date;
}

@Component({
  selector: 'app-stock-audit-dialog',
  templateUrl: './stock-audit-dialog.component.html',
  styleUrls: ['./stock-audit-dialog.component.scss']
})
export class StockAuditDialogComponent {
  audit: StockAuditEntry[];
  productName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { audit: StockAuditEntry[]; productName: string },
    public dialogRef: MatDialogRef<StockAuditDialogComponent>
  ) {
    this.audit = data.audit || [];
    this.productName = data.productName;
  }

  close(): void {
    this.dialogRef.close();
  }
}
