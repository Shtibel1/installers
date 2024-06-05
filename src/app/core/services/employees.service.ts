import { ServiceProvidersService } from './service-providers.service';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService extends BaseService {
  constructor(
    http: HttpClient,
    private serviceProvidersService: ServiceProvidersService
  ) {
    super(http, 'api/employees');
  }

  AddCategoriesToServiceProvider(cats: Category[], serviceProviderId: string) {
    const payload = {
      serviceProviderId,
      categories: cats,
    };

    return this.post(`AdjustCategoriesToServiceProvider`, { ...payload }).pipe(
      tap({
        next: () => {
          let sps = this.serviceProvidersService.installers$.value;
          let sp = sps.find((sp) => sp.id === serviceProviderId);
          sp.categories = cats;
          this.serviceProvidersService.installers$.next(sps);
        },
      })
    );
  }
}
