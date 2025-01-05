import { Assignment } from 'src/app/core/models/assignment.model';
import { Column } from 'src/app/shared/table/table.component';

export const InstallersColumnsConfig: Column[] = [
  {
    ref: 'id',
    label: 'מספר הזמנה',
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
    ref: 'customerName',
    label: 'שם לקוח',
    value: (element: Assignment) => `${element.customer.name}`,
  },
  {
    ref: 'cost',
    label: 'עלות',
    value: (element: Assignment) => `${element.cost}`,
  },
];
