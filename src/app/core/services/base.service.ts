import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

export abstract class BaseService {
  private apiUrl: string;
  private baseApiUrl: string = `${environment.baseApiUrl}`;
  constructor(protected http: HttpClient, apiUrl: string) {
    this.apiUrl = `${this.baseApiUrl}${apiUrl}`;
  }

  protected get<T>(
    endPointUrl: string,
    headers?: { headers: HttpHeaders }
  ): Observable<T | null> {
    return this.http.get<T>(`${this.apiUrl}/${endPointUrl}`, headers);
  }

  protected getWithoutApiUrl<Response>(
    url: string,
    headers?: { headers: HttpHeaders }
  ): Observable<Response | null> {
    return this.http.get<Response>(`${environment.baseApiUrl}${url}`, headers);
    //   .pipe(
    //       catchError(this.handleError(url, null)));
  }

  protected post<Res, Req>(
    endPointUrl: string,
    entity: Req,
    options?: { headers: HttpHeaders }
  ): Observable<Res | null> {
    return this.http.post<Res>(
      `${this.apiUrl}/${endPointUrl}`,
      entity,
      options
    );
    //   .pipe(
    //       catchError(err => this.handleError(err))
    //   );
  }

  protected put<Res, Req>(
    endPointUrl: string,
    entity: Req,
    options?: { headers: HttpHeaders }
  ): Observable<Res | null> {
    return this.http.put<Res>(`${this.apiUrl}/${endPointUrl}`, entity, options);
    // .pipe(
    //     catchError(err => this.handleError(err))
    // );
  }

  protected patch<Res, Req>(
    endPointUrl: string,
    entity: Req,
    options?: { headers: HttpHeaders }
  ): Observable<Res | null> {
    return this.http.patch<Res>(
      `${this.apiUrl}/${endPointUrl}`,
      entity,
      options
    );
    // .pipe(
    //     catchError(err => this.handleError(err))
    // );
  }

  protected postReqResp<Request, Response>(
    endPointUrl: string,
    entity: Request
  ): Observable<Response | null> {
    return this.http.post<Response>(`${this.apiUrl}/${endPointUrl}`, entity);
    //   .pipe(
    //       catchError(this.handleError(endPointUrl, null))
    //   );
  }

  protected delete<Response>(
    endPointUrl: string,
    headers?: { headers: HttpHeaders }
  ): Observable<Response | null> {
    return this.http.delete<Response>(`${this.apiUrl}/${endPointUrl}`, headers);
    // .pipe(
    //     catchError(err => this.handleError(err))
    // );
  }

  //   handleError<T>(operation = 'operation', result = {} as T): (error: HttpErrorResponse) => Observable<T> {

  //       return (error: HttpErrorResponse): Observable<T> => {
  //           console.error(error);

  //           const message = (error.error instanceof ErrorEvent) ?
  //               error.error.message :
  //               `server returned code ${error.status} with body "${error.error}"`;

  //           console.error(`${operation} failed: ${message}`);

  //           throw error.error;
  //       };
  //   }
}
