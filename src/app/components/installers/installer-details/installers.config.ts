import { Assignment } from 'src/app/core/models/assignment.model';
import { Column } from 'src/app/shared/table/table.component';

export const InstallersColumnsConfig: Column[] = [
  {
    ref: 'isPaid',
    label: 'שולם',
    value: (element: Assignment) => `${element.isPaid}`,
  },
  {
    ref: 'id',
    label: 'מספר הזמנה',
    value: (element: Assignment) => `${element.id}`,
  },
  {
    ref: 'customerName',
    label: 'שם לקוח',
    value: (element: Assignment) => `${element.customer.name}`,
  },
  {
    ref: 'address',
    label: 'כתובת',
    value: (element: Assignment) => `${element.customer.address}`,
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
];
