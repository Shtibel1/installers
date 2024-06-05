import { Status } from './../../enums/status.enum';
import { CommentModel } from '../commentModel.model';
import { Customer } from '../customer.model';
import { PickupStatus } from '../../enums/pickup-status.enum';
import { Marketer } from '../marketer.model';

export class AssignmentDto {
  id: string | null;
  date: string;
  customerNeedsToPay: number;
  customerAlreadyPaid: number | null;
  assignmentCost: number;
  installationPrice: number;
  innerFloorPrice: number;
  outerFloorPrice: number;
  carryPrice: number;
  employeeId: string;
  serviceProviderId: string;
  productId: string;
  customer: Customer;
  marketerId: string;
  comments?: CommentModel[] = [];
  status?: Status;
  pickupStatus?: PickupStatus;
}
