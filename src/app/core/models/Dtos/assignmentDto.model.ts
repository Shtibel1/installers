import { Status } from './../../enums/status.enum';
import { CommentModel } from '../commentModel.model';
import { Customer } from '../customer.model';

export class AssignmentDto {
  id: number;
  date: Date;
  customerPrice: number;
  totalPrice: number;
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
}
