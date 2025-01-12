import { DatePipe } from '@angular/common';
import { PickupStatusDescriptions } from 'src/app/core/enums/pickup-status.enum';
import { StatusDescriptions } from 'src/app/core/enums/status.enum';
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
    value: (element: Assignment) => `${StatusDescriptions[element.status]}`,
  },
  {
    ref: 'assignmentDate',
    label: 'תאריך ביצוע',
    value: (element: Assignment) => `${element.assignmentDate ?? ''}`,
  },

  {
    ref: 'customerNeedsToPay',
    label: 'הלקוח צריך לשלם',
    value: (element: Assignment) => `${element?.customerNeedsToPay ?? ''}`,
  },
  {
    ref: 'pickupStatus',
    label: 'סטטוס איסוף',
    value: (element: Assignment) =>
      `${PickupStatusDescriptions[element.pickupStatus]}`,
  },
  {
    ref: 'comments',
    label: 'הערות',
    value: (element: Assignment) => `${element?.comments[0]?.content ?? ''}`,
  },
];
