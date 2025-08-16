import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Assignment } from 'src/app/core/models/assignment.model';
import { ServiceProvider } from 'src/app/core/models/serviceProvider.model';
import { Calculation } from 'src/app/core/models/calculation.model';
import { AssignmentsService } from 'src/app/core/services/assignments.service';
import { ServiceProvidersService } from 'src/app/core/services/service-providers.service';
import { CalculationsService } from 'src/app/core/services/calculations.service';
import { InstallersColumnsConfig } from '../installers.config';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FiltersService } from 'src/app/components/filters-bar/filters-service.service';
import { forkJoin, of, finalize, switchMap, filter, take } from 'rxjs';
import { Status } from 'src/app/core/enums/status.enum';

@Component({
  selector: 'app-installer-calculations',
  templateUrl: './installer-calculations.component.html',
  styleUrls: ['./installer-calculations.component.scss'],
  providers: [FiltersService],
})
export class InstallerCalculationsComponent implements OnInit {
  installerId: string;
  installer: ServiceProvider;
  assignments: Assignment[] = [];
  filteredAssignments: Assignment[] = [];
  patchedAssignments: Assignment[] = [];
  totalCost = 0;
  columns = InstallersColumnsConfig;
  dataSource = new MatTableDataSource<Assignment>([]);
  
  description = new FormControl('');
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  isSaving = false;

  private get storageKey() {
    return `installer-calculations-checked-${this.installerId}`;
  }

  get selectedIds(): string[] {
    return this.patchedAssignments.map(a => a.id);
  }

  constructor(
    private _assignmentsService: AssignmentsService,
    private _serviceProvidersService: ServiceProvidersService,
    private _calculationsService: CalculationsService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _snackBar: MatSnackBar,

  ) {}

  ngOnInit(): void {
    this.installerId = this._activatedRoute.snapshot.params['id'];
    this.initInstaller();
    this.initRange();
    // Restore state if available
    const raw = sessionStorage.getItem(`calc-state-${this.installerId}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.range) {
          this.range.patchValue(parsed.range, { emitEvent: false });
        }
        if (parsed?.selectedIds) {
          sessionStorage.setItem(this.storageKey, JSON.stringify(parsed.selectedIds));
        }
      } catch {}
      sessionStorage.removeItem(`calc-state-${this.installerId}`);
    }
  }

  initInstaller() {
    // Trigger fetch if cache is empty (fire and forget)
    if (!this._serviceProvidersService.installers$?.value) {
      this._serviceProvidersService.getserviceProviders().subscribe();
    }
    // Wait until installers list is available, then pick the installer and load assignments
    this._serviceProvidersService.installers$
      .pipe(filter((list: any) => Array.isArray(list) && list.length > 0), take(1))
      .subscribe((installers: any[]) => {
        this.installer = installers.find((ins) => ins.id.toString() == this.installerId);
        if (this.installer) {
          this.initAssignments();
        }
      });
  }

  initAssignments() {
    this._assignmentsService.getAssignments().subscribe((assignments) => {
      this.assignments = assignments.filter(
        (a) => a.serviceProvider.id == this.installer?.id && !a.isPaid && a.status !== Status.canceled
      );
      this.filteredAssignments = this.assignments;
      this.filteredAssignments.sort((a, b) => {
        return (
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
      });
  // Restore checkbox state from storage
  this.restorePatchedState();
  this.dataSource = new MatTableDataSource(this.filteredAssignments);
    });
  }

  initRange() {
    this.range.valueChanges.subscribe((range) => {
      if (range.start && range.end) {
        this.filteredAssignments = this.assignments.filter((assignment) => {
          const assignmentDate = new Date(assignment.createdDate);
          return assignmentDate >= range.start && assignmentDate <= range.end;
        });
        this.dataSource = new MatTableDataSource(this.filteredAssignments);
      } else {
        this.filteredAssignments = this.assignments;
        this.dataSource = new MatTableDataSource(this.filteredAssignments);
      }
    });
  }

  onIsPaidChange(assignment: Assignment) {
    const idx = this.patchedAssignments.findIndex((a) => a.id === assignment.id);
    // Toggle selection based on current presence in patchedAssignments
    if (idx === -1) {
      this.patchedAssignments.push({ ...assignment });
    } else {
      this.patchedAssignments.splice(idx, 1);
    }
  this.calculateCost();
  this.savePatchedState();
  }

  calculateCost() {
    this.totalCost = this.patchedAssignments
      .map((a) => Number((a as any).cost) || 0)
      .reduce((a, b) => a + b, 0);
  }

  onCalculate() {
    if (this.isSaving || this.patchedAssignments.length === 0) return;

    const calculation: Calculation = {
      serviceProviderId: this.installerId,
      assignmentIds: this.patchedAssignments.map(a => a.id),
      price: this.totalCost,
      description: this.description.value || '',
      createdDate: new Date().toISOString(),
    };

    this.isSaving = true;
    this._calculationsService
      .addCalc(calculation)
      .pipe(
        switchMap(() => {
          const patches = this.patchedAssignments.map((a) =>
            this._assignmentsService.patchAssignment(a.id, [["/isPaid"], ["true"]])
          );
          return patches.length ? forkJoin(patches) : of(null);
        }),
        finalize(() => (this.isSaving = false))
      )
      .subscribe({
        next: () => {
          this.openSnackbar('התחשבנות נוצרה בהצלחה');
          const removedIds = new Set(this.patchedAssignments.map((a) => a.id));

          // Clear persisted selection after successful calculation
          sessionStorage.removeItem(this.storageKey);

          // Update shared assignments cache so other pages reflect the change immediately
          const current = this._assignmentsService.assignments$.value || [];
          this._assignmentsService.assignments$.next(
            current.filter((a) => !removedIds.has(a.id))
          );

          // Update local lists to remove the paid assignments
          this.assignments = this.assignments.filter((a) => !removedIds.has(a.id));
          this.filteredAssignments = this.filteredAssignments.filter((a) => !removedIds.has(a.id));
          this.dataSource = new MatTableDataSource(this.filteredAssignments);

          // Reset selection and totals
          this.patchedAssignments = [];
          this.totalCost = 0;
          this.description.reset();
        },
        error: () => {
          this.openSnackbar('שגיאה בשמירת התחשבנות או סימון הזמנות כשולם');
        },
      });
  }

  onExportToExcel() {
    const dataToExport = this.patchedAssignments.map((assignment) => ({
      'מספר הזמנה': assignment.id,
      'שם לקוח': assignment.customer.name,
      'כתובת': assignment.customer.address,
      'תאריך יצירה': new Date(assignment.createdDate).toLocaleDateString('he-IL'),
      'מחיר התקנה': assignment.additionalPrices
        .map((a) => a.price)
        .reduce((a, b) => a + b, 0),
      'תוספת מרחק': assignment.extras,
      'הלקוח שילם': assignment.customerNeedsToPay,
      'עלות': assignment.cost,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'התחשבנויות');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(blob, `התחשבנות_${this.installer?.name}_${new Date().toLocaleDateString('he-IL')}.xlsx`);
    this.openSnackbar('הקובץ יוצא בהצלחה');
  }

  clearDateFilter() {
    this.range.reset();
    this.filteredAssignments = this.assignments;
    this.dataSource = new MatTableDataSource(this.filteredAssignments);
  }

  onEditAssignment(assignment: Assignment) {
  // Navigate to the assignment manage form in edit mode, carry returnUrl to come back here after save
  // include a state snapshot: selectedIds and date range, so we can restore
  const state = {
    selectedIds: this.patchedAssignments.map(a => a.id),
    range: this.range.value,
  };
  sessionStorage.setItem(`calc-state-${this.installerId}`, JSON.stringify(state));
  this._router.navigate(['/assignments/manage', assignment.id], {
    queryParams: { returnUrl: this._router.url },
  });
  }

  openSnackbar(msg: string) {
    this._snackBar.open(msg, 'Ok', { duration: 4000 });
  }

  goBack() {
    this._router.navigate(['../'], { relativeTo: this._activatedRoute });
  }

  private savePatchedState() {
    try {
      const ids = this.patchedAssignments.map(a => a.id);
      sessionStorage.setItem(this.storageKey, JSON.stringify(ids));
    } catch {}
  }

  private restorePatchedState() {
    try {
      const raw = sessionStorage.getItem(this.storageKey);
      if (!raw) return;
      const ids: string[] = JSON.parse(raw);
      if (!Array.isArray(ids) || ids.length === 0) return;

      // Reset and re-apply
      this.patchedAssignments = [];
      const idSet = new Set(ids);
      this.filteredAssignments.forEach(a => {
        if (idSet.has(a.id)) {
          if (!this.patchedAssignments.find(pa => pa.id === a.id)) {
            this.patchedAssignments.push({ ...a });
          }
        }
      });
      if (this.patchedAssignments.length > 0) {
        this.calculateCost();
      }
    } catch {}
  }

  patchIsPaid(assignment: Assignment) {
    const pathsValus: string[][] = [
      ['/isPaid'], // The path to the property being updated
  ['true'], // Always set to true when calculation is performed
    ];

    this._assignmentsService
      .patchAssignment(assignment.id, pathsValus)
      .subscribe();
  }
}
