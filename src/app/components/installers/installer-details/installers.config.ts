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
    ref: 'additionals',
    label: 'מחיר ההתקנה',
    value: (element: Assignment) =>
      `${element.additionalPrices
        .map((a) => a.price)
        .reduce((a, b) => a + b, 0)}`,
  },

  {
    ref: 'extras',
    label: 'תוספת מרחק',
    value: (element: Assignment) => `${element.extras}`,
  },
  {
    ref: 'customerNeedsToPay',
    label: 'הלקוח שילם',
    value: (element: Assignment) => `${element.customerNeedsToPay}`,
  },

  {
    ref: 'cost',
    label: 'עלות',
    value: (element: Assignment) => `${element.cost}`,
  },
];
