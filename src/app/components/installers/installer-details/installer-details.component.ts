import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { tap } from 'rxjs';
import { Assignment } from 'src/app/core/models/assignment.model';
import { ServiceProvider } from 'src/app/core/models/serviceProvider.model';
import { AssignmentsService } from 'src/app/core/services/assignments.service';
import { ServiceProvidersService } from 'src/app/core/services/service-providers.service';
import { ManageInstallerComponent } from './manage-installer/manage-installer.component';
import { InstallersColumnsConfig } from './installers.config';
import { MatTableDataSource } from '@angular/material/table';
import { FiltersService } from '../../filters-bar/filters-service.service';
import { Status } from 'src/app/core/enums/status.enum';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import * as moment from 'moment';
import { AssignmentDto } from 'src/app/core/models/Dtos/assignmentDto.model';

interface Transaction {
  item: string;
  cost: number;
}

@Component({
  selector: 'app-installer-details',
  templateUrl: './installer-details.component.html',
  styleUrls: ['./installer-details.component.scss'],
  providers: [FiltersService],
})
export class InstallerDetailsComponent implements OnInit {
  installer: ServiceProvider;
  assignments: Assignment[];
  filteredAssignments: Assignment[];
  columns = InstallersColumnsConfig;
  date = new FormControl(null);
  dataSource: MatTableDataSource<Assignment>;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(
    private router: Router,
    private workersService: ServiceProvidersService,
    private route: ActivatedRoute,
    private assignmentService: AssignmentsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.initInstaller(params);
    });

    this.range.valueChanges.subscribe((range) => {
      let start = range.start;
      let end = range.end;
      this.filteredAssignments = this.assignments.filter(
        (a) =>
          new Date(a.createdDate).getTime() > start.getTime() &&
          new Date(a.createdDate).getTime() < end.getTime()
      );

      this.dataSource = new MatTableDataSource(this.filteredAssignments);
    });
  }

  initInstaller(params: Params) {
    this.workersService.installers$.subscribe((installers) => {
      if (!installers) {
        this.workersService.getserviceProviders().subscribe();
      } else {
        this.installer = installers.find(
          (ins) => ins.id.toString() == params['id']
        );
      }
      this.initAssignments();
    });
  }

  initAssignments() {
    this.assignmentService.getAssignments().subscribe((asmnts) => {
      this.assignments = asmnts.filter(
        (a) =>
          a.serviceProvider.id == this.installer.id && a.status === Status.done
      );
      this.filteredAssignments = this.assignments;
      this.filteredAssignments.sort((a, b) => {
        return (
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
      });
      this.dataSource = new MatTableDataSource(this.filteredAssignments);
    });
  }

  onPrices() {
    this.router.navigate([`${this.router.url}/prices`]);
  }

  onAddCategories() {
    this.dialog.open(ManageInstallerComponent, { data: this.installer });
  }

  onExportToExcel() {
    this.exportToExcel(this.filteredAssignments);
  }

  exportToExcel(assignments: Assignment[]): void {
    // 1. Create a worksheet from the array of assignment objects
    console.log(assignments);
    let list = assignments.map((a) => ({
      id: a.id,
      תאריך: a.createdDate,
      תאריך_התקנה: a.assignmentDate,
      שם_לקוח: a.customer.name,
      כתובת: a.customer.address,
      מוצר: a.product.name,
      עלןת: a.cost,
    }));
    console.log(list);
    const worksheet = XLSX.utils.json_to_sheet(list);

    // 2. Create a workbook and add the worksheet to it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assignments');

    // 3. Generate an Excel file
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // 4. Save the Excel file
    this.saveAsExcelFile(excelBuffer, 'Assignments');
  }

  onIsPaidChange(assignment: Assignment) {
    const pathsValus: string[][] = [
      ['/isPaid'], // The path to the property being updated
      [assignment.isPaid.toString()], // The new value as a string
    ];

    this.assignmentService
      .patchAssignment(assignment.id, pathsValus)
      .subscribe();
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }
}
