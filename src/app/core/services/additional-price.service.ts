import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  switchMap,
  tap,
  throwError
} from 'rxjs';
import { AdditionalPrice } from '../models/additionalPrice.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class AdditionalPriceService extends BaseService {
  prices$ = new BehaviorSubject<AdditionalPrice[]>([]);

  constructor(http: HttpClient) {
    super(http, 'api/AdditionalPrice');
  }

  getAdditionalPrices(id: string): Observable<AdditionalPrice[]> {
    return this.get<AdditionalPrice[]>(`${id}`);
  }

  getAdditionalPricesByProduct(spId: string, productId: string) {
    return this.get<AdditionalPrice[]>(`${spId}/${productId}`)
  }

  updatePrices(prices: AdditionalPrice[]): Observable<AdditionalPrice[]> {
    return this.put<AdditionalPrice[], any>('', prices);
  }
}

