import { Marketer } from 'src/app/core/models/marketer.model';
import { Column } from 'src/app/shared/table/table.component';

export const MarketersConfig: Column[] = [
  {
    ref: 'id',
    label: '#',
    value: (element: Marketer) => `${element.id}`,
  },
  {
    ref: 'name',
    label: 'שם',
    value: (element: Marketer) => `${element.name}`,
  },
];
