import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { tap } from 'rxjs';
import { Assignment } from 'src/app/core/models/assignment.model';
import { ServiceProvider } from 'src/app/core/models/installer.model';
import { AssignmentsService } from 'src/app/core/services/assignments.service';
import { UsersService } from 'src/app/core/services/users.service';

interface Transaction {
  item: string;
  cost: number;
}

@Component({
  selector: 'app-installer-details',
  templateUrl: './installer-details.component.html',
  styleUrls: ['./installer-details.component.scss'],
})
export class InstallerDetailsComponent implements OnInit {
  installer: ServiceProvider;
  assignments: Assignment[];
  filteredAssignments: Assignment[];

  displayedColumns = ['תאריך', 'עלות ההתקנה', 'הלקוח שילם', 'מאזן'];

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    private router: Router,
    private workersService: UsersService,
    private route: ActivatedRoute,
    private assignmentService: AssignmentsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.initInstaller(params);
    });

    this.range.valueChanges.subscribe((value) => {
      if (value.end) {
        this.filteredAssignments = this.assignments.filter(
          (a) =>
            new Date(a.createdDate).getTime() >= value.start.getTime() &&
            new Date(a.createdDate).getTime() <= value.end.getTime()
        );
      }
    });
  }

  onInstaller(installer: ServiceProvider) {
    this.router.navigate(['installers', installer.id]);
  }

  initInstaller(params: Params) {
    this.workersService.installersChain.subscribe((installers) => {
      if (!installers) {
        this.workersService.getInstallers().subscribe();
      } else {
        this.installer = installers.find(
          (ins) => ins.id.toString() == params['id']
        );
      }
      this.initAssignments();
    });
  }

  initAssignments() {
    this.assignmentService.assignmentsChain.subscribe((asmnts) => {
      if (!asmnts) {
        this.assignmentService.getAssignments().subscribe();
      } else {
        this.assignments = asmnts.filter(
          (a) => a.serviceProvider.id == this.installer.id
        );
        this.filteredAssignments = this.assignments;
      }
    });
  }

  onPrices() {
    this.router.navigate([`${this.router.url}/prices`]);
  }

  getTotalCost() {
    let sum = 0;
    if (this.assignments) this.assignments.forEach((a) => (sum += a.cost));
    return sum;
  }

  getCustomerCost() {
    let sum = 0;
    if (this.assignments) this.assignments.forEach((a) => (sum += a.price));
    return sum;
  }

  getBalance() {
    let sum = 0;
    if (this.assignments)
      this.assignments.forEach((a) => (sum += a.cost - a.price));
    return sum;
  }
}
