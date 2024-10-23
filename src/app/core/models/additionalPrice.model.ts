import { Additional } from "./additional.model";
import { Product } from "./product.model";

export interface AdditionalPrice {
  id?: string;
  price: number;
  product?: Product;
  additional?: Additional;
  productId: string;
  additionalId: string;
  serviceProviderId: string;
}