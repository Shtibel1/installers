import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class FiltersService {
  filters$ = new BehaviorSubject<FilterState>({});

  constructor() {}

  setFilters(filters: FilterState) {
    console.log('filters', filters);
    this.filters$.next(filters);
  }
}

export interface FilterState {
  search?: string;
  export?: boolean;
}
