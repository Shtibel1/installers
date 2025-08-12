import { ServiceProductVm } from 'src/app/core/services/service-products.service';
import { Column } from '../../shared/table/table.component';

export const ColumnsConfig: Column[] = [
  {
    ref: 'id',
    label: '#',
    value: (element: ServiceProductVm) => `${element.id}`,
  },
  {
    ref: 'name',
    label: 'שם שירות',
    value: (element: ServiceProductVm) => `${element.name}`,
  },
];
