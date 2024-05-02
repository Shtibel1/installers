import { Observable, map, startWith } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import {
  MatAutocomplete,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { Product } from 'src/app/core/models/product.model';
import { Form, FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-product',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatAutocompleteModule],
  templateUrl: './select-product.component.html',
  styleUrls: ['./select-product.component.scss'],
})
export class SelectProductComponent implements OnInit {
  @Input() control: FormControl;
  @Input() products: Product[];
  filteredProducts: Observable<Product[]>;

  @Output() productSelected = new EventEmitter<Product>();

  constructor() {}

  ngOnInit(): void {}

  filterProducts(name: string) {
    this.filteredProducts = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): Product[] {
    const filterValue = value.toLowerCase();

    return this.products.filter((product) =>
      product.name.toLowerCase().includes(filterValue)
    );
  }

  displayFn(product: Product): string {
    return product && product.name ? product.name : '';
  }

  onProduct(product, $event) {
    this.productSelected.emit(product);
  }
}
