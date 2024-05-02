import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { AssignmentsComponent } from './assignments.component';

const routes: Routes = [
  {
    path: '',
    component: AssignmentsComponent,
  },

  {
    path: 'manage-assignment',
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class AssignmentsModule {}
