import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServiceProvider } from '../models/installer.model';
import {
  BehaviorSubject,
  catchError,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceProvidersService extends BaseService {
  installers$ = new BehaviorSubject<ServiceProvider[] | null>(null);

  constructor(http: HttpClient) {
    super(http, 'api/serviceProviders');
  }

  getserviceProviders() {
    if (this.installers$.value) {
      return this.installers$;
    }
    return this.get<ServiceProvider[]>('').pipe(
      tap((installers) => {
        if (installers) this.installers$.next(installers);
      }),
      switchMap(() => this.installers$),
      catchError((err) => this.handleErrors(err))
    );
  }

  getServiceProvidersIds() {
    return this.getserviceProviders().pipe(
      map((installer) => installer.map((i) => i.id))
    );
  }

  private handleErrors(error: HttpErrorResponse) {
    let errMessage = 'בקשה שגויה! אם בעיה זו חוזרת התקשרו 0523452554';
    if (!error.error || !error.error.message) {
      return throwError(errMessage);
    }
    switch (error.error.message) {
      case 'FAILED_LOGIN':
        errMessage = 'שם משתמש או סיסמא שגויים';
        break;
      case 'FAILED_SIGNUP':
        errMessage = 'שגיאה! לא ניתן להוסיף משתמש';
    }
    return throwError(errMessage);
  }
}
