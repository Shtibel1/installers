import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Assignment } from 'src/app/core/models/assignment.model';
import { Category } from 'src/app/core/models/category.model';
import { Installer } from 'src/app/core/models/installer.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { AssignmentsService } from 'src/app/core/services/assignments.service';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { ManageAssignmentComponent } from './manage-assignment/manage-assignment.component';
import { WorkersService } from 'src/app/core/services/workers.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class AssignmentsComponent implements OnInit, AfterViewInit {
  editMode: boolean = false;
  form: FormGroup;
  errMessage: string;
  assignments: Assignment[] = [];
  dataSource: MatTableDataSource<Assignment>;
  columnsToDisplay = [
    'date',
    'customerName',
    'address',
    'phone',
    'installerName',
    'product',
    'commends',
    'status',
  ];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: Assignment[] | null;
  installers: Installer[];
  categories: Category[];

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private assignmentsService: AssignmentsService,
    private workersService: WorkersService,
    private categoriesService: CategoriesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initInstallers();
    this.initCategories();
    this.initAssignments();
  }

  ngAfterViewInit() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  nestedFilterCheck(search, data, key) {
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    } else {
      search += data[key];
    }
    return search;
  }

  initInstallers() {
    this.workersService.installersChain.subscribe((installers) => {
      if (!installers) {
        console.log('getInstallers');
        this.workersService.getInstallers().subscribe();
      } else {
        this.installers = installers;
      }
    });
  }

  initCategories() {
    this.categoriesService.categoriesChain.subscribe((categories) => {
      if (!categories) {
        this.categoriesService.getCategories().subscribe();
      } else {
        this.categories = categories;
      }
    });
  }

  initAssignments() {
    this.assignmentsService.assignmentsChain.subscribe((assigns) => {
      console.log(assigns);
      if (!assigns) {
        this.assignmentsService.getAssignments().subscribe();
      } else {
        this.assignments = assigns;
        this.dataSource = new MatTableDataSource<Assignment>(assigns);
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data, filter: string) => {
          const accumulator = (currentTerm, key) => {
            return this.nestedFilterCheck(currentTerm, data, key);
          };
          const dataStr = Object.keys(data)
            .reduce(accumulator, '')
            .toLowerCase();
          // Transform the filter by converting it to lowercase and removing whitespace.
          const transformedFilter = filter.trim().toLowerCase();
          return dataStr.indexOf(transformedFilter) !== -1;
        };
      }
    });
  }

  onAll() {
    this.dataSource = new MatTableDataSource(this.assignments);
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
      this.assignments.filter((a) => a.installer.name === installerName)
    );
  }

  onAssignment(assignment: Assignment) {
    this.dialog.open(ManageAssignmentComponent, {
      data: assignment,
      height: '100%',
    });
  }
}
