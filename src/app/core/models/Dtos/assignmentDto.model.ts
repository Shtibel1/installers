import { Status } from './../../enums/status.enum';
import { CommentModel } from '../commentModel.model';
import { Customer } from '../customer.model';
import { PickupStatus } from '../../enums/pickup-status.enum';

export class AssignmentDto {
  id: number | null;
  date: string;
  customerNeedsToPay: number;
  customerAlreadyPaid: number;
  assignmentCost: number;
  installationPrice: number;
  innerFloorPrice: number;
  outerFloorPrice: number;
  carryPrice: number;
  employeeId: string;
  serviceProviderId: string;
  productId: string;
  customer: Customer;
  comments?: CommentModel[] = [];
  status?: Status;
  pickupStatus?: PickupStatus;
}
