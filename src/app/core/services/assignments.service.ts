import { AuthService } from 'src/app/core/services/auth.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, switchMap, tap, throwError } from 'rxjs';
import { AssignmentDto } from '../models/Dtos/assignmentDto.model';
import { Assignment } from '../models/assignment.model';
import { BaseService } from './base.service';
import { Status } from '../enums/status.enum';

@Injectable({
  providedIn: 'root',
})
export class AssignmentsService extends BaseService {
  assignments$ = new BehaviorSubject<Assignment[] | null>(null);

  constructor(http: HttpClient, private AuthService: AuthService) {
    super(http, 'api/assignments');
  }

  getAssignments() {
    if (this.assignments$.value) {
      return this.assignments$;
    }
    return this.get<Assignment[]>('').pipe(
      tap((asmns) => {
        this.assignments$.next(asmns);
      }),
      switchMap(() => this.assignments$)
    );
  }

  getAssignment(id: string) {
    let companyName = this.AuthService.user$.value?.companies[0]?.name;
    return this.get<Assignment>(`${companyName}/${id.toString()}`);
  }

  createAssignment(assignmentDto: AssignmentDto) {
    assignmentDto.id = null;
    assignmentDto.status = Status.new;
    assignmentDto.customer.id = null;
    return this.postDep<Assignment, any>('', { ...assignmentDto }).pipe(
      tap((assignment) => {
        if (this.assignments$.value?.length > 0)
          this.assignments$.next([...this.assignments$.value, assignment]);
        else {
          this.assignments$.next([assignment]);
        }
      })
    );
  }

  updateAssignment(id: string, assignmentDto: AssignmentDto) {
    return this.put<Assignment, AssignmentDto>(`${id}`, {
      ...assignmentDto,
    }).pipe(
      tap((assignment) => {
        this.updateAssignmentInSubject(assignment);
      }),
      catchError((err) => this.handleAssignmentsError(err))
    );
  }

  patchAssignment(id: string, pathsValus: string[][]) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json-patch+json'
    );
    const patchDocument = [];

    for (let i = 0; i < pathsValus[0].length; i++) {
      patchDocument.push({
        op: 'replace',
        path: pathsValus[0][i],
        value: pathsValus[1][i],
      });
    }

    let user = this.AuthService.user$.value;
    let companyName = user?.companies[0]?.name;

    return this.patch(`${companyName}/${id.toString()}`, patchDocument, {
      headers,
    }).pipe(
      tap(() => {}),
      catchError((err) => this.handleAssignmentsError(err))
    );
  }

  // getAssignmentsByInstaller(id: string) {
  //   return this.get<Assignment[]>(id).pipe(
  //     catchError(err => this.handleAssignmentsError(err)))
  // }

  deleteAssignment(id: string) {
    const assignments: Assignment[] = this.assignments$.value || [];
    return this.delete(`${id}`).pipe(
      tap(() => {
        const index = assignments.findIndex((a) => a.id === id);
        if (index > -1) {
          this.assignments$.value.splice(index, 1);
          this.assignments$.next([...this.assignments$.value]);
        }
      })
    );
  }

  updateAssignmentInSubject(assignment: Assignment) {
    let assigments = this.assignments$.value || [];

    let isFound = false;
    for (let i = 0; i < assigments.length; i++) {
      if (assigments[i].id === assignment.id) {
        assigments[i] = assignment;
        isFound = true;
        break;
      }
    }
    if (!isFound) {
      assigments.push(assignment);
    }

    this.assignments$.next(assigments);
  }

  handleAssignmentsError(error: HttpErrorResponse) {
    let errMessage = 'בקשה שגויה! אם בעיה זו חוזרת התקשרו 0523452554';
    if (!error.error) {
      return throwError(errMessage);
    }
    switch (error.error) {
      case 'FAILED_UPDATE_ASSIGNMENT':
        errMessage = ' העדכון נכשל ';
        break;
      case 'FAILED_SIGNUP':
        errMessage = 'שגיאה! לא ניתן להוסיף משתמש';
    }

    return throwError(errMessage);
  }
}
