import { Assignment } from 'src/app/core/models/assignment.model';
import { Column } from 'src/app/shared/table/table.component';

export const InstallersColumnsConfig: Column[] = [
  {
    ref: 'id',
    label: '#',
    value: (element: Assignment) => `${element.id}`,
  },
  {
    ref: 'date',
    label: 'תאריך יצירה',
    value: (element: Assignment) => `${element.createdDate}`,
  },
  {
    ref: 'assignmentDate',
    label: 'תאריך סיום',
    value: (element: Assignment) => `${element?.assignmentDate || ''} `,
  },
  {
    ref: 'cost',
    label: 'עלות',
    value: (element: Assignment) => `${element.cost}`,
  },
  {
    ref: 'customer-paid',
    label: ' הלקוח שילם למתקין',
    value: (element: Assignment) => `${element?.customerNeedsToPay || 0}`,
  },
];
