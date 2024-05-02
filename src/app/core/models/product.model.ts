import { Category } from './category.model';

export interface Product {
  id: number;
  name: string;
  customerInstallationPrice: number;
  category: Category;
  position?: number;
}
