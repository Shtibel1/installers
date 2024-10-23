import { AppUser } from './app-user.model';
import { Customer } from './customer.model';
import { ServiceProvider } from './installer.model';
import { Product } from './product.model';
import { CommentModel } from './commentModel.model';
import { PickupStatus } from '../enums/pickup-status.enum';
import { Status } from '../enums/status.enum';
import { Marketer } from './marketer.model';
import { AdditionalPrice } from './additionalPrice.model';

export interface Assignment {
  id: string;
  createdDate: Date;
  assignmentDate?: Date;

  product: Product;
  customer: Customer;
  employee: AppUser;
  serviceProvider: ServiceProvider;
  status?: Status;

  customerAlreadyPaid: number;

  cost: number;
  price: number;
  additionalPrices: AdditionalPrice[];
  customerNeedsToPay: number;
  marketer: Marketer;

  pickupStatus?: PickupStatus;
  comments: CommentModel[];
}

// {
//   "id":7,
//   "createdDate":"2024-05-04T22:32:42",
//   "installationDate":null,
//   "customerNeedsToPay":1500,
//   "customerAlreadyPaid":null,
//   "totalPrice":0,
//   "installationPrice":1400,
//   "innerFloorPrice":750,
//   "outerFloorPrice":0,
//   "carryPrice":0,
//   "status":"פתוח",
//   "productId":1,
//   "customer":{
//      "id":7,
//      "name":"נדב",
//      "phone":"0523456789",
//      "address":"חדרה"
//   },
//   "installer":{
//      "categories":[

//      ],
//      "id":"ff3a4e8f-e042-4bb3-8385-c3ad0f58cfe7",
//      "name":"חמודי",
//      "phone":"0523456789",
//      "role":"installer"
//   },
//   "manager":{
//      "id":"041a9304-ffb3-4d4e-b4f0-452322ae07fa",
//      "name":"נדב",
//      "phone":"0523456789",
//      "role":"manager"
//   },
//   "comments":[

//   ]
// }
