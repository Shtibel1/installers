import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { Additional } from "../models/additional.model";
import { BehaviorSubject, catchError, Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root',
  })
  export class AdditionalsService extends BaseService {
    additionals$ = new BehaviorSubject<Additional[] | null>(null);

    constructor(http: HttpClient) {
      super(http, 'api/Additionals');
    }

    getAdditionals() : Observable<Additional[]> {
        if (this.additionals$.value) {
            return this.additionals$;
          }

        return this.get<Additional[]>('').pipe(
            tap((additionals) => {
                this.additionals$.next(additionals);
            })
        );
    }
  }