import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AppUser } from '../models/app-user.model';

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
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.user.token}`,
        },
      });
      return next.handle(req);
    }

    return next.handle(req);
  }
}
