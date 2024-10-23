import { Status } from './../../enums/status.enum';
import { CommentModel } from '../commentModel.model';
import { Customer } from '../customer.model';
import { PickupStatus } from '../../enums/pickup-status.enum';
import { Marketer } from '../marketer.model';

export class AssignmentDto {
  id: string | null;
  createdDate: string;
  customerNeedsToPay: number;
  customerAlreadyPaid: number | null;
  cost: number;
  employeeId: string;
  serviceProviderId: string;
  productId: string;
  customer: Customer;
  marketerId: string;
  comments?: CommentModel[] = [];
  status?: Status;
  pickupStatus?: PickupStatus;

}
