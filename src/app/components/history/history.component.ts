import { Component, OnInit } from '@angular/core';
import {
  AssignmentFilters,
  AssignmentsService,
} from 'src/app/core/services/assignments.service';
import { ShtibelModule } from '../../core/modules/shtibel.module';
import { MatTableDataSource } from '@angular/material/table';
import { Assignment } from 'src/app/core/models/assignment.model';
import { AssignmentColumnsConfig } from '../assignments/assignments-colums.config';
import { HistoryColumnsConfig } from './history-colums.config';
import { FiltersService } from '../filters-bar/filters-service.service';
import { FormControl } from '@angular/forms';
import { ServiceProvider } from 'src/app/core/models/serviceProvider.model';
import { Option } from 'src/app/core/models/option.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [ShtibelModule],
  providers: [FiltersService],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent implements OnInit {
  assignments: Assignment[] = [];
  dataSource: MatTableDataSource<Assignment>;
  columns = HistoryColumnsConfig;

  customerName = new FormControl<string>('');
  serviceProvider = new FormControl<Option<ServiceProvider>>(null);

  constructor(private assignmentsService: AssignmentsService) {}

  ngOnInit(): void {}

  onSearch() {
    let assignmentFilters: AssignmentFilters = {
      customerName: this.customerName.value,
      serviceProviderId: this.serviceProvider.value?.value?.id,
    };

    this.assignmentsService
      .getFiltredAssignments(assignmentFilters)
      .subscribe((assignments) => {
        this.assignments = assignments;
        this.dataSource = new MatTableDataSource(this.assignments);
      });
  }
}
