import { Product } from 'src/app/core/models/product.model';
import { Column } from '../../shared/table/table.component';

export const ColumnsConfig: Column[] = [
  {
    ref: 'id',
    label: '#',
    value: (element: Product) => `${element.id}`,
  },
  {
    ref: 'name',
    label: 'שם',
    value: (element: Product) => `${element.name}`,
  },
  {
    ref: 'category',
    label: 'קטגוריה',
    value: (element: Product) => `${element.category.name}`,
  },
];
