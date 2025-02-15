import { DatePipe } from '@angular/common';
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
  numOfProducts: number;

  constructor(ass: Assignment, datepipe: DatePipe) {
    this.id = ass.id;
    this.createdDate = datepipe.transform(
      ass.createdDate,
      'yyyy-MM-ddTHH:mm:ss'
    ); // Ensure conversion to Date
    this.assignmentDate = ass.assignmentDate
      ? datepipe.transform(ass.assignmentDate, 'yyyy-MM-ddTHH:mm:ss')
      : ''; // Convert assignmentDate if it exists
    this.customerNeedsToPay = ass.customerNeedsToPay;
    this.customerAlreadyPaid = ass.customerAlreadyPaid ?? null; // Handle nullable field
    this.cost = ass.cost;
    this.isPaid = ass.isPaid;
    this.employeeId = ass.employee?.id; // Assign employee ID
    this.serviceProviderId = ass.serviceProvider?.id; // Assign service provider ID
    this.productId = ass.product?.id; // Assign product ID
    this.customer = ass.customer; // Directly map customer
    this.customer.id = null;
    this.marketerId = ass.marketer?.id; // Assign marketer ID
    this.additionalPrices = ass.additionalPrices; // Map additional prices
    this.comments = ass.comments || []; // Assign comments or empty array
    this.status = ass.status;
    this.pickupStatus = ass.pickupStatus;
    this.extras = ass.extras;
  }
}
