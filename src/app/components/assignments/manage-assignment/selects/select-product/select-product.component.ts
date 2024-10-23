import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Option } from 'src/app/core/models/option.model';
import { Product } from 'src/app/core/models/product.model';
import { AdditionalsService } from 'src/app/core/services/additionals.service';
import { AdditionalPriceService } from 'src/app/core/services/additional-price.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { ServiceProvidersService } from 'src/app/core/services/service-providers.service';

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
  ) {}

  ngOnInit(): void {
    this.initProducts();
    if (this.control.value?.value) {
    }
  }

  initProducts() {
    this.productsService.getProducts().subscribe((products) => {
      this.productsOptions = products.map((product) => {
        return { label: product.name, value: product };
      });
    });
  }
}
