import { Assignment } from './assignment.model';
import { ServiceProvider } from './serviceProvider.model';

export interface Calculation {
  id?: string;
  createdDate?: string;
  price: number;
  description: string;
  serviceProviderId: string;
  serviceProvider?: ServiceProvider;
  assignmentIds: string[];
  assignments?: Assignment[];
}
