import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService extends BaseService {
  private categories$ = new BehaviorSubject<Category[]>([]);

  constructor(http: HttpClient) {
    super(http, 'api/categories');
  }

  getCategory(id: string): Observable<Category> {
    return this.get<Category>(`${id}`);
  }

  getCategories(): Observable<Category[]> {
    if (this.categories$.value.length) {
      return this.categories$.asObservable();
    }

    return this.get<Category[]>(``).pipe(
      tap((categories) => this.categories$.next(categories)),
      switchMap(() => this.categories$)
    );
  }

  createCategory(category: Category): Observable<Category> {
    return this.post<Category>('', category).pipe(
      tap((newCategory) => {
        this.categories$.next([...this.categories$.value, newCategory]);
      })
    );
  }

  deleteCategory(id: string): Observable<void> {
    return this.delete<void>(`${id}`).pipe(
      tap(() => {
        const categories = this.categories$.value.filter(
          (category) => category.id !== id
        );
        this.categories$.next(categories);
      })
    );
  }

  updateCategory(id: string, category: Category): Observable<void> {
    return this.put<void, Category>(`${id}`, category).pipe(
      tap(() => {
        const categories = this.categories$.value.map((c) =>
          c.id === id ? category : c
        );
        this.categories$.next(categories);
      })
    );
  }
}
