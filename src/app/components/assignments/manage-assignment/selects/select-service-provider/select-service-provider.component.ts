import { Additionals } from './../../assignment-additionals/additionals.service';
import { InstallersPricesService } from 'src/app/core/services/installers-prices.service';
import { ServiceProvidersService } from './../../../../../core/services/service-providers.service';
import {
  OnInit,
  Input,
  Component,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ServiceProvider } from 'src/app/core/models/installer.model';
import { Option } from 'src/app/core/models/option.model';
import { ServiceProviderPricing } from 'src/app/core/models/installerPricing.model';
import { AdditionalsForm } from '../../assignment-additionals/assignment-additionals.component';
import { AdditionalsService } from '../../assignment-additionals/additionals.service';
import { KeyValue } from '@angular/common';
import { take, tap } from 'rxjs';

@Component({
  selector: 'app-select-service-provider',
  templateUrl: './select-service-provider.component.html',
  styleUrl: './select-service-provider.component.scss',
})
export class SelectServiceProviderComponent implements OnInit {
  @Input() control: FormControl<Option<ServiceProvider>>;

  allServicePridersOptions: Option<ServiceProvider>[] = [];
  serviceProvidersOptions: Option<ServiceProvider>[] = [];
  priceComprarison: Map<string, ServiceProviderPricing>;

  additionals: Additionals;

  constructor(
    private serviceProvidersService: ServiceProvidersService,
    private installersPricesService: InstallersPricesService,
    private additionalsService: AdditionalsService
  ) {}

  ngOnInit(): void {
    this.initserviceProviders().subscribe(() => {
      this.initPriceComparison().subscribe(() => {
        this.initAdditionals().subscribe();
      });
    });
  }

  initserviceProviders() {
    return this.serviceProvidersService.getserviceProviders().pipe(
      take(1),
      tap((serviceProviders) => {
        this.serviceProvidersOptions = serviceProviders.map(
          (serviceProvider) => {
            return { label: serviceProvider.name, value: serviceProvider };
          }
        );
        this.allServicePridersOptions = [...this.serviceProvidersOptions];
      })
    );
  }

  initPriceComparison() {
    return this.installersPricesService.pricesComparison$.pipe(
      tap((prices) => {
        if (!prices && this.additionals) {
          this.serviceProvidersOptions = [{ label: 'אין תוצאות', value: null }];
          return;
        }

        if (!prices && !this.additionals) {
          this.serviceProvidersOptions = this.allServicePridersOptions;
          return;
        }

        this.priceComprarison = prices;
        this.calculate();
        this.serviceProvidersOptions = this.serviceProvidersOptions.sort(
          (a, b) => {
            return a.price > b.price ? 1 : -1;
          }
        );
      })
    );
  }

  initAdditionals() {
    return this.additionalsService.additionals$.pipe(
      tap((additionals) => {
        if (!additionals) {
          this.serviceProvidersOptions = this.allServicePridersOptions?.map(
            (op) => {
              op.price = null;
              return op;
            }
          );
          return;
        }
        this.additionals = additionals;
        this.calculate();
      })
    );
  }
  calculate() {
    console.log(this.control.value);
    this.serviceProvidersOptions = [];
    this.allServicePridersOptions.forEach((serviceProviderOpt) => {
      const prices = this.priceComprarison?.get(serviceProviderOpt.value?.id);

      let total = 0;
      let doesntHaveAll = false;

      if (this.additionals?.hasInnerFloor && prices?.innerFloorPrice) {
        total += prices.innerFloorPrice;
      } else if (this.additionals?.hasInnerFloor && !prices?.innerFloorPrice)
        doesntHaveAll = true;

      if (this.additionals?.hasOuterFloor && prices?.outerFloorPrice) {
        total += prices.outerFloorPrice;
      } else if (this.additionals?.hasOuterFloor && !prices?.outerFloorPrice)
        doesntHaveAll = true;

      if (this.additionals?.hasCarry && prices?.carryPrice) {
        total += prices.carryPrice;
      } else if (this.additionals?.hasCarry && !prices?.carryPrice)
        doesntHaveAll = true;

      if (prices?.installationPrice) {
        total += prices.installationPrice;
      } else {
        doesntHaveAll = true;
      }

      if (!doesntHaveAll) {
        serviceProviderOpt.price = total.toString();
        this.serviceProvidersOptions.push(serviceProviderOpt);
        this.serviceProvidersOptions = this.serviceProvidersOptions.sort(
          (a, b) => {
            return +a.price > +b.price ? 1 : -1;
          }
        );
      }
    });

    const selectedOption = this.serviceProvidersOptions.find(
      (op) => op.value.id === this.control.value?.value?.id
    );

    if (selectedOption) this.control.setValue(selectedOption);

    if (this.serviceProvidersOptions.length === 0) {
      this.serviceProvidersOptions = [{ label: 'אין תוצאות', value: null }];
    }
  }

  getAdditionalsPrices(): ServiceProviderPricing {
    var prices = this.priceComprarison.get(this.control.value.value.id);
    //remove false additionals from prices
    if (!this.additionals.hasInnerFloor) {
      prices.innerFloorPrice = 0;
    }
    if (!this.additionals.hasOuterFloor) {
      prices.outerFloorPrice = 0;
    }
    if (!this.additionals.hasCarry) {
      prices.carryPrice = 0;
    }
    return prices;
  }
}
