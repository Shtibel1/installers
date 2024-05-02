export interface InstallerPricing {
  productId: number;
  createdDate: Date;
  startFromDate: Date;
  installationPrice: number;
  outerFloorPrice: number;
  innerFloorPrice: number;
  carryPrice: number;
  installerId?: string;
  id?: number;
}
