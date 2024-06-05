import { ServiceProvider } from 'src/app/core/models/installer.model';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Option } from 'src/app/core/models/option.model';
import { Product } from 'src/app/core/models/product.model';
import { InstallersPricesService } from 'src/app/core/services/installers-prices.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { ServiceProvidersService } from 'src/app/core/services/service-providers.service';
import { FiltersService } from 'src/app/components/filters-bar/filters-service.service';
import { AdditionalsService } from '../../assignment-additionals/additionals.service';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.component.html',
  styleUrl: './select-product.component.scss',
})
export class SelectProductComponent implements OnInit {
  @Input() control: FormControl<Option<Product>>;
  productsOptions: Option<Product>[] = [];

  constructor(
    private productsService: ProductsService,
    private ServiceProvider: ServiceProvidersService,
    private serviceProviderPricing: InstallersPricesService,
    private additionals: AdditionalsService
  ) {}

  ngOnInit(): void {
    this.initProducts();
    if (this.control.value?.value) {
      console.log(this.control.value?.value);
    }

    this.ServiceProvider.getServiceProvidersIds()
      .pipe(
        filter((a) => !!a),
        take(1)
      )
      .subscribe((serviceProviderIds) => {
        if (this.control.value?.value) {
          this.serviceProviderPricing
            .getPriceComparison(
              serviceProviderIds,
              this.control.value?.value.id
            )
            .subscribe();
        }

        this.control.valueChanges.subscribe(
          (productOpt: Option<Product> | string | null) => {
            if (!productOpt || typeof productOpt === 'string') {
              this.serviceProviderPricing.clearPricesComparison();
              this.additionals.resetAdditionals();
              return;
            }

            this.serviceProviderPricing
              .getPriceComparison(serviceProviderIds, productOpt.value.id)
              .subscribe();
          }
        );
      });
  }

  initProducts() {
    this.productsService.getProducts().subscribe((products) => {
      this.productsOptions = products.map((product) => {
        return { label: product.name, value: product };
      });
    });
  }
}
