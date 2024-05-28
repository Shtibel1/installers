import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServiceProvider } from '../models/installer.model';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends BaseService {
  installersChain = new BehaviorSubject<ServiceProvider[] | null>(null);

  constructor(http: HttpClient) {
    super(http, 'api/serviceProviders');
  }

  getInstallers() {
    return this.get<ServiceProvider[]>('').pipe(
      tap((installers) => {
        if (installers) this.installersChain.next(installers);
      }),
      catchError((err) => this.handleErrors(err))
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
