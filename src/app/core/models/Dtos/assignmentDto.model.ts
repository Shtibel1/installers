import { PickupStatus } from '../../enums/pickup-status.enum';
import { AdditionalPrice } from '../additionalPrice.model';
import { CommentModel } from '../commentModel.model';
import { Customer } from '../customer.model';
import { Status } from './../../enums/status.enum';

export class AssignmentDto {
  id: string | null;
  createdDate: string;
  assignmentDate: string;
  customerNeedsToPay: number;
  customerAlreadyPaid: number | null;
  cost: number;
  employeeId: string;
  serviceProviderId: string;
  productId: string;
  customer: Customer;
  marketerId: string;
  additionalPrices: AdditionalPrice[];
  comments?: CommentModel[] = [];
  status?: Status;
  pickupStatus?: PickupStatus;
  extras: number;
}
