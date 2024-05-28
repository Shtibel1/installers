import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ServiceProviderPricing } from '../models/installerPricing.model';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InstallersPricesService extends BaseService {
  pricesChain = new BehaviorSubject<ServiceProviderPricing[]>([]);

  constructor(http: HttpClient) {
    super(http, 'api/ServiceProviderPricing');
  }

  getPricesByInstaller(installerId: string) {
    return this.get<ServiceProviderPricing[]>(`${installerId}`).pipe(
      tap((prices) => {
        this.pricesChain.next(prices);
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
        let newPrices = this.pricesChain.value.filter(
          (p) => p.installerId === installerId
        );
        resPrices.forEach((p) => {
          newPrices.push(p);
        });
        this.pricesChain.next(newPrices);
      }),
      catchError((err) => this.handlePricesError(err))
    );
  }

  getInstallerPrice(installerId: string, productId: string) {
    return this.get<ServiceProviderPricing>(`${installerId}/${productId}`).pipe(
      catchError((err) => this.handlePricesError(err))
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
