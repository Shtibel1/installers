import { Column } from './../../shared/table/table.component';

export const ColumnsConfig: Column[] = [
  {
    ref: 'id',
    label: 'ID',
    value: 'id',
  },
  {
    ref: 'name',
    label: 'Name',
    value: 'name',
  },
  {
    ref: 'category',
    label: 'Category',
    value: 'category.name',
  },
  {
    ref: 'customerInstallationPrice',
    label: 'מחיר התקנה',
    value: 'customerInstallationPrice',
  },
];
