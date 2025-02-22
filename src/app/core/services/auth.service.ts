import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Manager, ManagerDto } from '../models/manager.model';
import { Installer, InstallerDto } from '../models/installer.model';
import { Category } from '../models/category.model';
import {
  BehaviorSubject,
  Observable,
  catchError,
  of,
  tap,
  throwError,
} from 'rxjs';
import { AppUser } from '../models/app-user.model';
import { Router } from '@angular/router';
import { WorkersService } from './workers.service';
import { environment } from 'src/environments/environment';
import { Role } from '../enums/roles.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<AppUser | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private workersService: WorkersService
  ) {}

  // url = `https://jltrinpj51.execute-api.eu-north-1.amazonaws.com/Prod/Account`
  url = `${environment.baseApiUrl}api/auth`;

  login(username: string, password: string) {
    return this.http
      .post<AppUser>(`${this.url}/login`, { username, password })
      .pipe(
        tap((user) => {
          if (user) {
            this.handleAuth(user);
          }
        }),
        catchError((error) => this.handleAccountsError(error))
      );
  }

  createInstaller(installer: InstallerDto, password: string) {
    return this.http
      .post<{ message: string }>(`${this.url}/signup`, {
        ...installer,
        password: password,
        role: Role.ServiceProvider,
      })
      .pipe(
        tap((res) => this.workersService.getInstallers()),
        catchError((err) => this.handleAccountsError(err))
      );
  }

  createManager(manager: ManagerDto, password: string) {
    return this.http
      .post<{ message: string }>(`${this.url}/signup`, {
        ...manager,
        password,
        role: Role.Employee,
      })
      .pipe(catchError((err) => this.handleAccountsError(err)));
  }

  logout() {
    localStorage.removeItem('user');
    this.user$.next(null);
    this.router.navigate(['auth']);
  }

  autoLogin() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson) as AppUser;
      this.user$.next(user);
    }
  }

  handleAuth(user: AppUser) {
    this.user$.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  handleAccountsError(error: HttpErrorResponse): Observable<string> {
    if (error.status == 400) {
      return throwError(() => 'שם משתמש כבר קיים');
    }
    if (error.status == 401) {
      return throwError(() => 'שם משתמש או סיסמא לא נכונים');
    }
    if (error.status == 500) {
      return throwError(() => 'שגיאת שרת');
    }

    return throwError(() => 'שגיאה לא ידועה');
  }
}
