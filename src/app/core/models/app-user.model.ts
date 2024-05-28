import { Roles } from '../enums/roles.enum';
import { Category } from './category.model';
import { Company } from './company.model';

export interface AppUser {
  id: string;
  name: string;
  token: string;
  role: Roles;
  phone?: string;
  companies?: Company[];
}
