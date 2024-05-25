import { Category } from './category.model';
import { Company } from './company.model';

export interface AppUser {
  id: string;
  name: string;
  token: string;
  role: string;
  phone?: string;
  companies?: Company[];
}
