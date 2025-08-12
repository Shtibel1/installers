import { Product } from 'src/app/core/models/product.model';
import { ProductRequirementVm } from 'src/app/core/services/service-products.service';
import { Column } from '../../shared/table/table.component';

type ProductWithRequirements = Product & { requirements?: ProductRequirementVm[] };

export const ColumnsConfig: Column[] = [
  {
    ref: 'id',
    label: '#',
    value: (element: ProductWithRequirements) => `${element.id}`,
  },
  {
    ref: 'name',
    label: 'שם',
    value: (element: ProductWithRequirements) => `${element.name}`,
  },
  {
    ref: 'category',
    label: 'קטגוריה',
    value: (element: ProductWithRequirements) => `${element.category.name}`,
  },
  {
    ref: 'requirements',
    label: 'דרישות שירותים',
    value: (element: ProductWithRequirements) => {
      if (!element.requirements || element.requirements.length === 0) {
        return 'אין דרישות';
      }
      return element.requirements
        .map(req => `${req.serviceProductName || 'שירות לא ידוע'} (${req.quantity})`)
        .join(', ');
    },
  },
];
