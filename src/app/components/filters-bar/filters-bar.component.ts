import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';
import { FiltersService } from './filters-service.service';

@Component({
  selector: 'app-filters-bar',
  templateUrl: './filters-bar.component.html',
  styleUrl: './filters-bar.component.scss',
})
export class FiltersBarComponent {
  range = new FormGroup({
    start: new FormControl<Date | null>(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ),
    end: new FormControl<Date>(new Date()),
  });

  search = new FormControl<string>(null);
  user;
  subject: string;
  hideDateRage = false;

  constructor(
    private filtersService: FiltersService,
    private dialog: MatDialog,
    private authServivce: AuthService
  ) {}

  ngOnInit(): void {
    this.authServivce.user$.subscribe((user) => {
      this.user = user;
    });
    this.listenToSearch();
  }

  listenToSearch() {
    this.search.valueChanges.subscribe((search) => {
      this.filtersService.filters$.next({
        ...this.filtersService.filters$.value,
        search,
      });
    });
  }

  // listenToDateRange() {
  //   this.range.valueChanges.subscribe((range) => {
  //     if (range.start && range.end) {
  //       this.filtersService.dateRange$.next({
  //         start: range.start,
  //         end: range.end,
  //       });
  //     }
  //   });
  // }

  onAdd() {}

  exportToExcel() {
    this.filtersService.filters$.next({
      ...this.filtersService.filters$.value,
      export: true,
    });
  }
}
