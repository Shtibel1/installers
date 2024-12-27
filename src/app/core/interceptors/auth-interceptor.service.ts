import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AppUser } from '../models/app-user.model';
import { Roles } from '../enums/roles.enum';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  user?: AppUser | null;
  constructor(private accountsService: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.accountsService.user$.subscribe((user) => {
      this.user = user;
    });

    if (this.user) {
      if (this.user.role === Roles.ServiceProvider) {
        alert('You are not authorized to perform this action');
      }
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.user.token}`,
        },
      });
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error && error.status === 401) {
            this.accountsService.logout();
          }
          return throwError(error);
        })
      );
    }

    return next.handle(req);
  }
}
