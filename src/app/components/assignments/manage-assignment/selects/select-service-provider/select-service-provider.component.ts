import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { take, tap } from 'rxjs';
import { ServiceProvider } from 'src/app/core/models/installer.model';
import { AdditionalPrice } from 'src/app/core/models/additionalPrice.model';
import { Option } from 'src/app/core/models/option.model';
import { AdditionalPriceService } from 'src/app/core/services/additional-price.service';
import { ServiceProvidersService } from './../../../../../core/services/service-providers.service';
import { AdditionalsService } from 'src/app/core/services/additionals.service';
import { Additional } from 'src/app/core/models/additional.model';

@Component({
  selector: 'app-select-service-provider',
  templateUrl: './select-service-provider.component.html',
  styleUrl: './select-service-provider.component.scss',
})
export class SelectServiceProviderComponent implements OnInit {
  @Input() control: FormControl<Option<ServiceProvider>>;

  allServicePridersOptions: Option<ServiceProvider>[] = [];
  serviceProvidersOptions: Option<ServiceProvider>[] = [];
  priceComprarison: Map<string, AdditionalPrice>;

  additionals: AdditionalPrice[] = [];

  constructor(
    private serviceProvidersService: ServiceProvidersService,
    private installersPricesService: AdditionalPriceService,
    private additionalsService: AdditionalsService
  ) {}

  ngOnInit(): void {
    this.initserviceProviders();
  }

  initserviceProviders() {
    return this.serviceProvidersService.getserviceProviders().subscribe(sp => {
      this.serviceProvidersOptions = sp.map(sp => {
        return {
          label: sp.name,
          value: sp,
        };
      });
    })
    
  }
}
