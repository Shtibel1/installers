import { SnackbarService } from './snackbar.service';
import { Assignment } from './../models/assignment.model';
import { Injectable, OnDestroy } from '@angular/core';
import {
  EMPTY,
  Subscription,
  catchError,
  delay,
  retryWhen,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { AssignmentsService } from './assignments.service';
import { AppUser } from '../models/app-user.model';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService implements OnDestroy {
  private socket$: WebSocketSubject<Assignment>;
  private websocketUrl = `${environment.baseApiUrl}api/ws`;
  private connectionSubscription: Subscription;

  constructor(
    private assignmentsService: AssignmentsService,
    private snackbarService: SnackbarService
  ) {
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    this.socket$ = this.getNewWebSocket();

    this.socket$.subscribe(
      (assignment) => this.handleMessage(assignment),
      (err) => console.error('WebSocket error after retries:', err),
      () => console.log('WebSocket connection closed')
    );
  }

  private getNewWebSocket(): WebSocketSubject<Assignment> {
    let user: AppUser = JSON.parse(localStorage.getItem('user'));
    let company = user?.companies[0]?.name;
    this.websocketUrl = `${this.websocketUrl}/${company}`;
    return new WebSocketSubject<Assignment>(this.websocketUrl);
  }

  sendMessage(assignment: Assignment) {
    this.socket$.next(assignment);
  }

  private handleMessage(message: Assignment) {
    console.log('Received message from server: ', message);
    this.assignmentsService.updateAssignmentInSubject(message);
    this.snackbarService.openSnackBar(`התקנה מספר ${message.id} עודכנה`);
  }

  ngOnDestroy() {
    console.log('Websocket service destroyed');
    if (this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
    }
  }

  private closeConnection() {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
