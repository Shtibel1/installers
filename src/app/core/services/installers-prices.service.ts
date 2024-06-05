import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ServiceProviderPricing } from '../models/installerPricing.model';
import {
  BehaviorSubject,
  catchError,
  tap,
  throwError,
  map,
  of,
  Observable,
} from 'rxjs';
import { KeyValue } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class InstallersPricesService extends BaseService {
  prices$ = new BehaviorSubject<ServiceProviderPricing[]>([]);
  pricesComparison$ = new BehaviorSubject<Map<
    string,
    ServiceProviderPricing
  > | null>(null);

  constructor(http: HttpClient) {
    super(http, 'api/ServiceProviderPricing');
  }

  getPricesByInstaller(installerId: string) {
    return this.get<ServiceProviderPricing[]>(`${installerId}`).pipe(
      tap((prices) => {
        this.prices$.next(prices);
      }),
      catchError((err) => this.handlePricesError(err))
    );
  }

  updatePricesTable(installerId: string, prices: ServiceProviderPricing[]) {
    return this.put<ServiceProviderPricing[], ServiceProviderPricing[]>(
      `${installerId}`,
      [...prices]
    ).pipe(
      tap((resPrices) => {
        let newPrices = this.prices$.value.filter(
          (p) => p.installerId === installerId
        );
        resPrices.forEach((p) => {
          newPrices.push(p);
        });
        this.prices$.next(newPrices);
      }),
      catchError((err) => this.handlePricesError(err))
    );
  }

  getInstallerPrice(installerId: string, productId: string) {
    return this.get<ServiceProviderPricing>(`${installerId}/${productId}`).pipe(
      catchError((err) => this.handlePricesError(err))
    );
  }

  clearPricesComparison() {
    // this.pricesComparison$.next(null);
  }

  getPriceComparison(
    installerIds: string[],
    productId: string
  ): Observable<ServiceProviderPricing[]> {
    let hasAllIds = installerIds.every((id) =>
      this.pricesComparison$.value?.has(id)
    );
    if (hasAllIds) {
      return of(this.pricesComparison$.value?.values().return().value);
    }

    let dto: PriceComparisonDto = {
      serviceProviderIds: installerIds,
      ProductId: productId,
    };

    return this.post<ServiceProviderPricing[]>('prices-comparison', dto).pipe(
      tap({
        next: (prices) => {
          let map = new Map<string, ServiceProviderPricing>();
          prices.forEach((p) => {
            map.set(p.installerId, p);
          });
          this.pricesComparison$.next(map);
        },
      })
    );
  }

  handlePricesError(error: HttpErrorResponse) {
    let errMessage = 'בקשה שגויה! אם בעיה זו חוזרת התקשרו 0523452554';
    if (!error.error || !error.error.message) {
      return throwError(errMessage);
    }
    switch (error.error.message) {
      case 'FAILED_GET_PRICES':
        errMessage = 'שגיאה בטעינת המוצרים';
        break;
      case 'FAILED_UPDATE_PRICES':
        errMessage = 'שגיאה בעדכון המוצרים';
    }
    return throwError(errMessage);
  }
}

interface PriceComparisonDto {
  serviceProviderIds: string[];
  ProductId: string;
}
