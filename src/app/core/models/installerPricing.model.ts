export interface ServiceProviderPricing {
  id?: string;
  installerId?: string;
  productId: string;
  createdDate: Date;

  installationPrice: number;
  outerFloorPrice: number;
  innerFloorPrice: number;
  carryPrice: number;
  distancePrice: number;
  deliveryOnlyPrice: number;
}
