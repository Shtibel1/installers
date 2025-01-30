import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Assignment } from 'src/app/core/models/assignment.model';
import { Category } from 'src/app/core/models/category.model';
import { ServiceProvider } from 'src/app/core/models/serviceProvider.model';
import { AssignmentsService } from 'src/app/core/services/assignments.service';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { FiltersService } from '../filters-bar/filters-service.service';
import { AssignmentColumnsConfig } from './assignments-colums.config';
import { Status } from 'src/app/core/enums/status.enum';
import { ServiceProvidersService } from 'src/app/core/services/service-providers.service';
import { Option } from 'src/app/core/models/option.model';
import { PickupStatus } from 'src/app/core/enums/pickup-status.enum';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss'],
  providers: [FiltersService],
})
export class AssignmentsComponent implements OnInit {
  editMode: boolean = false;
  form: FormGroup;
  errMessage: string;
  assignments: Assignment[] = [];
  dataSource: MatTableDataSource<Assignment>;
  columns = AssignmentColumnsConfig;
  expandedElement: Assignment[] | null;
  installers: ServiceProvider[];
  categories: Category[];
  installerControl = new FormControl<Option<ServiceProvider>>(null);
  statusControl = new FormControl<Status>(null);
  pickupStatusControl = new FormControl<PickupStatus>(null);

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private assignmentsService: AssignmentsService,
    private workersService: ServiceProvidersService,
    private categoriesService: CategoriesService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initInstallers();
    this.initCategories();
    this.initAssignments();
  }

  onSearch() {
    let filteredAsgmts = this.assignments;
    if (this.installerControl.value)
      filteredAsgmts = filteredAsgmts.filter(
        (a) => a.serviceProvider.name == this.installerControl.value.value.name
      );
    if (this.statusControl.value !== null)
      filteredAsgmts = filteredAsgmts.filter(
        (a) => a.status === this.statusControl.value
      );
    if (this.pickupStatusControl.value !== null)
      filteredAsgmts = filteredAsgmts.filter(
        (a) => a.pickupStatus === this.pickupStatusControl.value
      );
    this.dataSource = new MatTableDataSource(filteredAsgmts);
  }

  onResetFilters() {
    this.installerControl.setValue(null);
    this.statusControl.setValue(null);
    this.pickupStatusControl.setValue(null);
    console.log(this.pickupStatusControl.value);
    this.dataSource = new MatTableDataSource(this.assignments);
  }

  initInstallers() {
    this.workersService.installers$.subscribe((installers) => {
      if (!installers) {
        this.workersService.getserviceProviders().subscribe();
      } else {
        this.installers = installers;
      }
    });
  }

  initCategories() {
    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  initAssignments() {
    this.assignmentsService.assignments$.subscribe((assigns) => {
      if (!assigns) {
        this.assignmentsService.getAssignments().subscribe();
      } else {
        this.assignments = assigns;
        this.dataSource = new MatTableDataSource<Assignment>(
          assigns.sort(
            (a, b) =>
              new Date(b.createdDate).getTime() -
              new Date(a.createdDate).getTime()
          )
        );
        this.dataSource.sort = this.sort;
      }
    });
  }

  onAll() {
    this.dataSource = new MatTableDataSource(this.assignments);
  }

  onAdd() {
    this.router.navigate(['assignments', 'manage']);
  }

  onCategory(categoryName: string) {
    this.dataSource = new MatTableDataSource(
      this.assignments.filter((a) =>
        a.product.category.name
          .toLowerCase()
          .includes(categoryName.toLowerCase())
      )
    );
  }

  onAssignment(assignment: Assignment) {
    this.router.navigate(['assignments', 'manage', assignment.id]);
  }
}
