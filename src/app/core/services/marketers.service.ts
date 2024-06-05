import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap } from 'rxjs';
import { BaseService } from './base.service';
import { Marketer } from '../models/marketer.model';

@Injectable({
  providedIn: 'root',
})
export class MarketersService extends BaseService {
  marketers$ = new BehaviorSubject<Marketer[]>([]);

  constructor(http: HttpClient) {
    super(http, 'api/marketers');
  }

  getMarketer(id: string): Observable<Marketer> {
    return this.get<Marketer>(`${id}`);
  }

  getMarketers(): Observable<Marketer[]> {
    if (this.marketers$.value.length) {
      return this.marketers$.asObservable();
    }

    return this.get<Marketer[]>(``).pipe(
      tap({ next: (marketers) => this.marketers$.next(marketers) }),
      switchMap(() => this.marketers$)
    );
  }

  createMarketer(marketer: Marketer): Observable<Marketer> {
    return this.postDep<Marketer, Marketer>('', marketer).pipe(
      tap((newMarketer) => {
        this.marketers$.next([...this.marketers$.value, newMarketer]);
      })
    );
  }

  deleteMarketer(id: string): Observable<void> {
    return this.delete<void>(`${id}`).pipe(
      tap(() => {
        const marketers = this.marketers$.value.filter(
          (marketer) => marketer.id !== id
        );
        this.marketers$.next(marketers);
      })
    );
  }

  updateMarketer(id: string, marketer: Marketer): Observable<void> {
    return this.put<void, Marketer>(`${id}`, marketer).pipe(
      tap(() => {
        const marketers = this.marketers$.value.map((m) =>
          m.id === id ? marketer : m
        );
        this.marketers$.next(marketers);
      })
    );
  }
}
