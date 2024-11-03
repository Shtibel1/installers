import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
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

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss'],
  providers: [FiltersService],
})
export class AssignmentsComponent implements OnInit, AfterViewInit {
  editMode: boolean = false;
  form: FormGroup;
  errMessage: string;
  assignments: Assignment[] = [];
  dataSource: MatTableDataSource<Assignment>;
  columns = AssignmentColumnsConfig;
  expandedElement: Assignment[] | null;
  installers: ServiceProvider[];
  categories: Category[];

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

  ngAfterViewInit() {}

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
        this.dataSource = new MatTableDataSource<Assignment>(assigns.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()));
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

  onInstaller(installerName: string) {
    this.dataSource = new MatTableDataSource(
      this.assignments.filter((a) => a.serviceProvider.name === installerName)
    );
  }

  onAssignment(assignment: Assignment) {
    this.router.navigate(['assignments', 'manage', assignment.id]);
  }
}
