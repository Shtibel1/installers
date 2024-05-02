import { Category } from './category.model';

export interface AppUser {
  id: string;
  name: string;
  token: string;
  role: string;
  username?: string;
  phone?: string;
  categories?: Category[];
}
