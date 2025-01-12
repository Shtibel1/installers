import { PickupStatus } from '../../enums/pickup-status.enum';
import { AdditionalPrice } from '../additionalPrice.model';
import { Assignment } from '../assignment.model';
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
  isPaid: boolean;
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

  constructor(ass: Assignment) {
    this.id = ass.id;
    this.createdDate = new Date(ass.createdDate).toISOString(); // Ensure conversion to Date
    this.assignmentDate = ass.assignmentDate
      ? new Date(ass.assignmentDate).toISOString()
      : ''; // Convert assignmentDate if it exists
    this.customerNeedsToPay = ass.customerNeedsToPay;
    this.customerAlreadyPaid = ass.customerAlreadyPaid ?? null; // Handle nullable field
    this.cost = ass.cost;
    this.isPaid = ass.isPaid;
    this.employeeId = ass.employee?.id; // Assign employee ID
    this.serviceProviderId = ass.serviceProvider?.id; // Assign service provider ID
    this.productId = ass.product?.id; // Assign product ID
    this.customer = ass.customer; // Directly map customer
    this.marketerId = ass.marketer?.id; // Assign marketer ID
    this.additionalPrices = ass.additionalPrices; // Map additional prices
    this.comments = ass.comments || []; // Assign comments or empty array
    this.status = ass.status;
    this.pickupStatus = ass.pickupStatus;
    this.extras = ass.extras;
  }
}
