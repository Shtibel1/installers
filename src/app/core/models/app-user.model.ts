import { Role } from '../enums/roles.enum';
import { Category } from './category.model';

export interface AppUser {
  id: string;
  name: string;
  token: string;
  role: Role;
  username?: string;
  phone?: string;
  categories?: Category[];
}

