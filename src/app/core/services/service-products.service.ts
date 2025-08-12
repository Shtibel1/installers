// service-supplies.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BaseService } from './base.service';

// ---- DTOs / VMs -------------------------------------------------------------
export interface ServiceProductVm {
  id: string;
  name: string;
}

export interface ProductRequirementVm {
  serviceProductId: string;
  serviceProductName?: string;
  quantity: number;
}

export interface ServiceProviderStockVm {
  id: string;
  serviceProviderIdExternal: string;
  serviceProductId: string;
  serviceProductName?: string;
  amount: number;
}

export interface StockAdjustmentVm {
  serviceProviderIdExternal: string;
  serviceProductId: string;
  delta: number; // +in / -out
  performedByUserId?: string | null;
  referenceId?: string | null;
  reason?: string | null;
}

export interface ShortageVm {
  serviceProductId: string;
  serviceProductName?: string;
  required: number;
  have: number;
  missing: number;
}

@Injectable({ providedIn: 'root' })
export class ServiceSuppliesService extends BaseService {
  // cache like ProductsService
  serviceProducts$ = new BehaviorSubject<ServiceProductVm[] | null>(null);

  constructor(http: HttpClient) {
    // base route matches the controller we created
    super(http, 'api/ServiceProducts');
  }

  // ===== Service Products (CRUD) ============================================

  getServiceProducts(): Observable<ServiceProductVm[]> {
    if (this.serviceProducts$.value) return this.serviceProducts$ as BehaviorSubject<ServiceProductVm[]>;
    return this.get<ServiceProductVm[]>('service-products').pipe(
      tap(list => this.serviceProducts$.next(list)),
      catchError(err => this.handleError(err))
    );
  }

  getServiceProduct(id: string): Observable<ServiceProductVm> {
    return this.get<ServiceProductVm>(`service-products/${id}`).pipe(
      catchError(err => this.handleError(err))
    );
  }

  addServiceProduct(sp: ServiceProductVm): Observable<ServiceProductVm> {
    return this.post<ServiceProductVm>('service-products', { name: sp.name }).pipe(
      tap(created => {
        const cur = this.serviceProducts$.value ?? [];
        this.serviceProducts$.next([...cur, created]);
      }),
      catchError(err => this.handleError(err))
    );
  }

  updateServiceProduct(sp: ServiceProductVm): Observable<void> {
    return this.put<void, ServiceProductVm>(`service-products/${sp.id}`, sp).pipe(
      tap(() => {
        const arr = this.serviceProducts$.value;
        if (!arr) return;
        const idx = arr.findIndex(x => x.id === sp.id);
        if (idx >= 0) {
          const updated = [...arr];
          updated[idx] = { ...sp };
          this.serviceProducts$.next(updated);
        }
      }),
      catchError(err => this.handleError(err))
    );
  }

  deleteServiceProduct(id: string): Observable<void> {
    return this.delete<void>(`service-products/${id}`).pipe(
      tap(() => {
        const arr = this.serviceProducts$.value ?? [];
        this.serviceProducts$.next(arr.filter(x => x.id !== id));
      }),
      catchError(err => this.handleError(err))
    );
  }

  // ===== Product Requirements ===============================================

  getRequirements(productId: string): Observable<ProductRequirementVm[]> {
    return this.get<ProductRequirementVm[]>(`products/${productId}/requirements`).pipe(
      catchError(err => this.handleError(err))
    );
  }

  setAllRequirements(productId: string, reqs: ProductRequirementVm[]): Observable<void> {
    return this.put<void, ProductRequirementVm[]>(`products/${productId}/requirements`, reqs).pipe(
      catchError(err => this.handleError(err))
    );
  }

  upsertRequirement(productId: string, serviceProductId: string, quantity: number): Observable<void> {
    // quantity via query param per controller
    return this.put<void, unknown>(`products/${productId}/requirements/${serviceProductId}?quantity=${quantity}`, {}).pipe(
      catchError(err => this.handleError(err))
    );
  }

  removeRequirement(productId: string, serviceProductId: string): Observable<void> {
    return this.delete<void>(`products/${productId}/requirements/${serviceProductId}`).pipe(
      catchError(err => this.handleError(err))
    );
  }

  // ===== Provider Stock (+ audit) ===========================================

  getProviderStock(providerId: string): Observable<ServiceProviderStockVm[]> {
    return this.get<ServiceProviderStockVm[]>(`providers/${providerId}/stock`).pipe(
      catchError(err => this.handleError(err))
    );
  }

  getStockAmount(providerId: string, serviceProductId: string): Observable<number> {
    return this.get<number>(`providers/${providerId}/stock/${serviceProductId}`).pipe(
      catchError(err => this.handleError(err))
    );
  }

  adjustStock(adj: StockAdjustmentVm): Observable<void> {
    return this.post<void>('providers/stock/adjust', adj).pipe(
      catchError(err => this.handleError(err))
    );
  }

  // ===== Helper: shortages ===================================================

  getShortages(providerId: string, productId: string, includeNames = false): Observable<ShortageVm[]> {
    const q = includeNames ? '?includeNames=true' : '';
    return this.get<ShortageVm[]>(`providers/${providerId}/shortages/${productId}${q}`).pipe(
      catchError(err => this.handleError(err))
    );
  }

  // ===== utils (local) =======================================================

  getByIds(ids: string[]): ServiceProductVm[] {
    const cur = this.serviceProducts$.value ?? [];
    const set = new Set(ids);
    return cur.filter(x => set.has(x.id));
  }

  findByName(name: string): ServiceProductVm | undefined {
    const cur = this.serviceProducts$.value ?? [];
    const n = (name ?? '').trim().toLowerCase();
    return cur.find(x => x.name.toLowerCase() === n);
  }

  // ===== error handling ======================================================

  private handleError(error: HttpErrorResponse) {
    // align with your style/messages
    let errMessage = 'בקשה נכשלה. אם הבעיה חוזרת התקשרו 052-3452554';
    const msg: string | undefined = error?.error?.message;

    switch (msg) {
      case 'FAILED_CREATE_SERVICE_PRODUCT':
        errMessage = 'יצירת שירות נכשלה';
        break;
      case 'FAILED_UPDATE_SERVICE_PRODUCT':
        errMessage = 'עדכון שירות נכשל';
        break;
      case 'FAILED_DELETE_SERVICE_PRODUCT':
        errMessage = 'מחיקת שירות נכשלה';
        break;
      case 'FAILED_GET_SERVICE_PRODUCTS':
      case 'FAILED_GET_SERVICE_PRODUCT':
        errMessage = 'טעינת שירותים נכשלה';
        break;
    }
    return throwError(() => errMessage);
  }
}
