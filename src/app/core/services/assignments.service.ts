import { AuthService } from 'src/app/core/services/auth.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { AssignmentDto } from '../models/Dtos/assignmentDto.model';
import { Assignment } from '../models/assignment.model';
import { BaseService } from './base.service';
import { Status } from '../enums/status.enum';

@Injectable({
  providedIn: 'root',
})
export class AssignmentsService extends BaseService {
  assignmentsChain = new BehaviorSubject<Assignment[] | null>(null);

  constructor(http: HttpClient, private AuthService: AuthService) {
    super(http, 'api/assignments');
  }

  getAssignments() {
    return this.get<Assignment[]>('').pipe(
      tap((asmns) => {
        this.assignmentsChain.next(asmns);
      })
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
    return this.post<Assignment, any>('', { ...assignmentDto }).pipe(
      tap((assignment) => {
        if (this.assignmentsChain.value?.length > 0)
          this.assignmentsChain.next([
            ...this.assignmentsChain.value,
            assignment,
          ]);
        else {
          this.assignmentsChain.next([assignment]);
        }
      })
    );
  }

  updateAssignment(id: number, assignmentDto: AssignmentDto) {
    return this.put<Assignment, AssignmentDto>(`${id}`, {
      ...assignmentDto,
    }).pipe(
      tap((assignment) => {
        this.updateAssignmentInSubject(assignment);
      }),
      catchError((err) => this.handleAssignmentsError(err))
    );
  }

  patchAssignment(id: number, pathsValus: string[][]) {
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

    return this.patch(id.toString(), patchDocument, { headers }).pipe(
      tap(() => {}),
      catchError((err) => this.handleAssignmentsError(err))
    );
  }

  // getAssignmentsByInstaller(id: string) {
  //   return this.get<Assignment[]>(id).pipe(
  //     catchError(err => this.handleAssignmentsError(err)))
  // }

  deleteAssignment(id: number) {
    const assignments: Assignment[] = this.assignmentsChain.value || [];
    return this.delete(`${id}`).pipe(
      tap(() => {
        const index = assignments.findIndex((a) => a.id === id);
        if (index > -1) {
          this.assignmentsChain.value.splice(index, 1);
          this.assignmentsChain.next([...this.assignmentsChain.value]);
        }
      })
    );
  }

  updateAssignmentInSubject(assignment: Assignment) {
    let assigments = this.assignmentsChain.value || [];

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

    this.assignmentsChain.next(assigments);
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
