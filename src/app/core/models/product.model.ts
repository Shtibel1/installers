import { Category } from './category.model';

export interface Product {
  id: string;
  name: string;
  customerInstallationPrice: number;
  category: Category;
  position?: number;
}
