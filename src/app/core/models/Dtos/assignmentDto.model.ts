import { Status } from './../../enums/status.enum';
import { CommentModel } from '../commentModel.model';
import { Customer } from '../customer.model';
import { PickupStatus } from '../../enums/pickup-status.enum';

export class AssignmentDto {
  id: number;
  date: string;
  customerNeedsToPay: number;
  customerAlreadyPaid: number;
  assignmentCost: number;
  installationPrice: number;
  innerFloorPrice: number;
  outerFloorPrice: number;
  carryPrice: number;
  managerId: string;
  installerId: string;
  productId: number;
  customer: Customer;
  comments?: CommentModel[] = [];
  status?: string;
  pickupStatus?: PickupStatus;
}
