import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Calculation } from '../models/calculation.model';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalculationsService extends BaseService {
  calculations$ = new BehaviorSubject<Calculation[] | null>(null);

  constructor(http: HttpClient) {
    super(http, 'api/calculations');
  }

  getCalcs() {
    return this.get<Calculation[]>('').pipe(
      tap((calcs) => {
        this.calculations$.next(calcs);
      })
    );
  }

  getCalc(id: string) {
    return this.get<Calculation>(id);
  }

  addCalc(calc: Calculation) {
    return this.post<Calculation>('', calc).pipe(
      tap((calc) => {
        if (this.calculations$.value?.length > 0)
          this.calculations$.next([...this.calculations$.value, calc]);
        else {
          this.calculations$.next([calc]);
        }
      })
    );
  }
}
