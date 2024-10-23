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

  getAdditionalPrice(id: string): Observable<AdditionalPrice[]> {
    return this.get<AdditionalPrice[]>(`${id}`);
  }

  getAdditionalPrices(): Observable<AdditionalPrice[]> {
    if (this.prices$.value.length) {
      return this.prices$.asObservable();
    }

    return this.get<AdditionalPrice[]>(``).pipe(
      tap({ next: (prices) => this.prices$.next(prices) }),
      switchMap(() => this.prices$)
    );
  }

  createAdditionalPrice(price: AdditionalPrice): Observable<AdditionalPrice> {
    return this.postDep<AdditionalPrice, AdditionalPrice>('', price).pipe(
      tap((newPrice) => {
        this.prices$.next([...this.prices$.value, newPrice]);
      })
    );
  }

  deleteAdditionalPrice(id: string): Observable<void> {
    return this.delete<void>(`${id}`).pipe(
      tap(() => {
        const updatedPrices = this.prices$.value.filter(
          price => price.id !== id
        );
        this.prices$.next(updatedPrices);
      })
    );
  }

  updateAdditionalPrice(id: string, price: AdditionalPrice): Observable<void> {
    return this.put<void, AdditionalPrice>(`${id}`, price).pipe(
      tap(() => {
        const updatedPrices = this.prices$.value.map(p =>
          p.id === id ? price : p
        );
        this.prices$.next(updatedPrices);
      })
    );
  }

  updatePrices(prices: AdditionalPrice[]): Observable<AdditionalPrice[]> {
    return this.put<AdditionalPrice[], any>('', prices).pipe(
      tap(updatedPrices => {
        // You can also update your BehaviorSubject here if needed
        this.prices$.next(updatedPrices);
      })
    );
  }
}

