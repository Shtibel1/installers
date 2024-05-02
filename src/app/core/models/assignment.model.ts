import { AppUser } from './app-user.model';
import { Customer } from './customer.model';
import { Installer } from './installer.model';
import { Product } from './product.model';
import { CommentModel } from './commentModel.model';

export interface Assignment {
  id: number; //assignment field
  createdDate: Date; //assignment field
  installationDate?: Date; //not field
  customerNeedsToPay: number;
  totalPrice: number; //not field
  installationPrice: number; //not field
  innerFloorPrice: number; //not field
  outerFloorPrice: number; //not field
  carryPrice: number;
  status: string; //assignment field
  product: Product; //product field
  customer: Customer; //customer field
  manager: AppUser; //assignment field
  installer: Installer; //assignment field
  comments: CommentModel[]; //comments field
}

{
  //customer
  //
}
