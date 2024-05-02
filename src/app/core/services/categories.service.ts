import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService extends BaseService {
  categoriesChain  = new BehaviorSubject<Category[] | null>(null);

  constructor(
    http: HttpClient
  ) {
    super(http, "api/categories");
  }

  getCategories() {
    return this.get<Category[]>("").pipe(
      tap(res => {
        this.categoriesChain.next(res)
      })
    )
  }
}
