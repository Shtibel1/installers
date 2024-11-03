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

  dataSource: MatTableDataSource<Assignment>;

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
  }

  onAddProduct() {
    this.dialog.open(ManageInstallerComponent);
  }

  onProduct(p: ServiceProvider) {
    this.dialog.open(ManageInstallerComponent, { data: p });
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
        (a) => a.serviceProvider.id == this.installer.id
      );
      this.filteredAssignments = this.assignments;
      this.dataSource = new MatTableDataSource(this.filteredAssignments);
    });
  }

  onPrices() {
    this.router.navigate([`${this.router.url}/prices`]);
  }

  onAddCategories() {
    this.dialog.open(ManageInstallerComponent, { data: this.installer });
  }
}
