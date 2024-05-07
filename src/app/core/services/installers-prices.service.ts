import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { InstallerPricing } from '../models/installerPricing.model';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InstallersPricesService extends BaseService {
  pricesChain = new BehaviorSubject<InstallerPricing[]>([]);

  constructor(http: HttpClient) {
    super(http, 'api/InstallerPricing');
  }

  getPricesByInstaller(installerId: string) {
    return this.get<InstallerPricing[]>(`${installerId}`).pipe(
      tap((prices) => {
        this.pricesChain.next(prices);
      }),
      catchError((err) => this.handlePricesError(err))
    );
  }

  updatePricesTable(installerId: string, prices: InstallerPricing[]) {
    return this.put<InstallerPricing[], InstallerPricing[]>(`${installerId}`, [
      ...prices,
    ]).pipe(
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

  getInstallerPrice(installerId: string, productId: number) {
    return this.get<InstallerPricing>(`${installerId}/${productId}`).pipe(
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
