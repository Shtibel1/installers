import { AppUser } from './app-user.model';
import { Category } from './category.model';

interface ServiceProvider {
  id?: string;
  name: string;
  phone: string;
  role: string;
  email: string;
  categories: Category[];
}

interface InstallerDto {
  id?: string;
  name: string;
  phone: string;
  role: string;
  email: string;
  categories: string[];
}

export { ServiceProvider, InstallerDto };
