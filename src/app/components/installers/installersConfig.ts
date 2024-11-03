import { ServiceProvider } from 'src/app/core/models/serviceProvider.model';
import { Column } from 'src/app/shared/table/table.component';

export const ColumnsConfig: Column[] = [
  {
    ref: 'id',
    label: '#',
    value: (element: ServiceProvider) => `${element.id}`,
  },
  {
    ref: 'name',
    label: 'שם',
    value: (element: ServiceProvider) => `${element.name}`,
  },
  {
    ref: 'categories',
    label: 'קטגוריות',
    value: (element: ServiceProvider) =>
      element.categories.map((category) => category.name).join(', '),
  },
];
