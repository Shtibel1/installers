import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product } from '../models/product.model';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends BaseService {
  products$ = new BehaviorSubject<Product[] | null>(null);

  constructor(http: HttpClient) {
    super(http, 'api/products');
  }

  getProducts() {
    return this.get<Product[]>('').pipe(
      tap((products) => {
        this.products$.next(products);
      }),
      catchError((err) => this.handleProductsError(err))
    );
  }

  addProduct(product: Product) {
    return this.post<
      Product,
      { name: string; customerInstallationPrice: number; categoryId: number }
    >('', {
      name: product.name,
      customerInstallationPrice: product.customerInstallationPrice,
      categoryId: product.category.id,
    }).pipe(
      tap((product) => {
        this.products$.next([...this.products$.value, product]);
      }),
      catchError((err) => this.handleProductsError(err))
    );
  }

  updateProduct(product: Product) {
    return this.put<
      Product,
      {
        id: number;
        name: string;
        customerInstallationPrice: number;
        categoryId: number;
      }
    >(`${product.id}`, {
      id: product.id,
      name: product.name,
      customerInstallationPrice: product.customerInstallationPrice,
      categoryId: product.category.id,
    }).pipe(
      tap((updatedProduct) => {
        for (let i = 0; i < this.products$.value.length; i++) {
          if (this.products$.value[i].id == updatedProduct.id) {
            this.products$.value[i] = updatedProduct;
          }
        }
        this.products$.next([...this.products$.value]);
      }),
      catchError((err) => this.handleProductsError(err))
    );
  }

  deleteProduct(id: number) {
    return this.delete(`${id}`).pipe(
      tap(() => {
        let updatedProducts = this.products$.value.filter((p) => p.id != id);
        this.products$.next([...updatedProducts]);
      }),
      catchError((err) => this.handleProductsError(err))
    );
  }

  getProductsByCategories(categories: Category[]) {
    return this.products$.value.filter((p) =>
      categories.some((c) => c.id == p.category.id)
    );
  }

  handleProductsError(error: HttpErrorResponse) {
    let errMessage = 'בקשה שגויה! אם בעיה זו חוזרת התקשרו 0523452554';
    if (!error.error || !error.error.message) {
      return throwError(errMessage);
    }
    switch (error.error.message) {
      case 'FAILED_CREATE_PRODUCT':
        errMessage = 'שם משתמש או סיסמא שגויים';
        break;
      case 'FAILED_GET_PRODUCT' || 'FAILED_GET_PRODUCTS':
        errMessage = 'לא ניתן לטעון מוצרים';
        break;
      case 'FAILED_DELETE_PRODUCT':
        errMessage = 'לא ניתן למחוק את מוצר';
        break;
    }
    return throwError(errMessage);
  }
}
