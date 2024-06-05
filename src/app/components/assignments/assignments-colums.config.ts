import { Assignment } from 'src/app/core/models/assignment.model';
import { Column } from 'src/app/shared/table/table.component';

export const AssignmentColumnsConfig: Column[] = [
  {
    ref: 'id',
    label: '#',
    value: (element: Assignment) => `${element.id}`,
  },

  {
    ref: 'date',
    label: 'תאריך',
    value: (element: Assignment) => `${element.createdDate}`,
  },
  {
    ref: 'product',
    label: 'מוצר',
    value: (element: Assignment) => `${element.product.name}`,
  },
  {
    ref: 'customer',
    label: 'לקוח',
    value: (element: Assignment) => `${element.customer.name}`,
  },
  {
    ref: 'address',
    label: 'כתובת',
    value: (element: Assignment) => `${element.customer.address}`,
  },
  {
    ref: 'serviceProvider',
    label: 'ספק שירות',
    value: (element: Assignment) => `${element.serviceProvider.name}`,
  },
  {
    ref: 'status',
    label: 'סטטוס',
    value: (element: Assignment) => `${element.status}`,
  },

  {
    ref: 'customerNeedsToPay',
    label: 'הלקוח צריך לשלם',
    value: (element: Assignment) => `${element?.customerNeedsToPay ?? ''}`,
  },
  {
    ref: 'pickupStatus',
    label: 'סטטוס איסוף',
    value: (element: Assignment) => `${element.pickupStatus}`,
  },
  {
    ref: 'comments',
    label: 'הערות',
    value: (element: Assignment) => `${element?.comments[0]?.content ?? ''}`,
  },
];
