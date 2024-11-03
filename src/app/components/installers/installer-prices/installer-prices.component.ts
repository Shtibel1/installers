import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { take, tap } from 'rxjs';
import { ServiceProvider } from 'src/app/core/models/serviceProvider.model';
import { Product } from 'src/app/core/models/product.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { AdditionalPriceService } from 'src/app/core/services/additional-price.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { BaseComponent } from '../../common/base/base.component';
import { Roles } from 'src/app/core/enums/roles.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceProvidersService } from 'src/app/core/services/service-providers.service';
import { Additional } from 'src/app/core/models/additional.model';
import { AdditionalsService } from 'src/app/core/services/additionals.service';
import { AdditionalPrice } from 'src/app/core/models/additionalPrice.model';

@Component({
  selector: 'app-installer-prices',
  templateUrl: './installer-prices.component.html',
  styleUrls: ['./installer-prices.component.scss'],
})
export class InstallerPricesComponent extends BaseComponent implements OnInit {
  installer: ServiceProvider;
  prodFormArray: FormArray;
  addPricesForm: FormGroup = new FormGroup({});
  products: Product[] = [];
  pricesArray: AdditionalPrice[] = [];
  currentPrices: AdditionalPrice[] = [];
  additionals: Additional[];
  errMessage: any;

  constructor(
    private route: ActivatedRoute,
    private workersService: ServiceProvidersService,
    private productsService: ProductsService,
    private cdr: ChangeDetectorRef,
    private pricesService: AdditionalPriceService,
    private _snackBar: MatSnackBar,
    private additionalsService: AdditionalsService, 
    private additionalsPricesService: AdditionalPriceService,
    authService: AuthService
  ) {
    super(authService);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.workersService
        .getServiceProvider(params['id'])
        .pipe(take(1))
        .subscribe((installer) => {
          this.installer = installer;
          this.initAddtionals().subscribe(() => {
            this.initProducts().subscribe(() => {
              this.initAdditionalsPrices().subscribe(() => {
                this.initForm();
              });
            });
          });
        });
    });    
  }
  initForm() {
    this.prodFormArray = new FormArray(
      this.products.map((product, i) => {
        const additionalPrices = this.additionals.map((additional, j) => {
          console.log(this.currentPrices)
          const currentPrice = this.currentPrices.find(price => price.productId === product.id && price.additionalId === additional.id);
          return new FormGroup({
            price: new FormControl(currentPrice ? currentPrice.price : 0, Validators.required),
            productId: new FormControl(product.id),
            additionalId: new FormControl(additional.id),
            serviceProviderId: new FormControl(this.installer.id)
          });
        });
  
        return new FormGroup({
          productName: new FormControl({ value: product.name, disabled: true }),
          additionalPrices: new FormArray(additionalPrices)
        });
      })
    );
  
    this.addPricesForm = new FormGroup({
      products: this.prodFormArray
    });
  
    this.cdr.detectChanges();
  }


  getPriceFormGroup(productIndex: number, additionalIndex: number): FormGroup {
    return (this.prodFormArray.at(productIndex) as FormGroup).controls['additionalPrices']['controls'][additionalIndex];
  }

  initAddtionals() {
    return this.additionalsService.getAdditionals().pipe(
      tap((additionals) => {
        this.additionals = additionals;
      }
    ))
  }
  initProducts() {
    return this.productsService.getProducts().pipe(tap((products) => {
      this.products = products;
      })
    );
  }
    
  initAdditionalsPrices() {
    return this.additionalsPricesService.getAdditionalPrices(this.installer.id).pipe(
      tap((prices) => {
        this.currentPrices = prices;
      })
    );
  }

  onSubmit() {
    if (this.addPricesForm.valid) {
      const filledPrices: AdditionalPrice[] = [];
  
      // Prepare the data for submission
      this.addPricesForm.value.products.forEach((productGroup: any, productIndex: number) => {
        productGroup.additionalPrices.forEach((priceGroup: any, additionalIndex: number) => {
          const existingPrice = this.currentPrices.find(price => 
            price.productId === this.products[productIndex].id &&
            price.additionalId === this.additionals[additionalIndex].id
          );
          if (!existingPrice || existingPrice.price !== priceGroup.price) { 

            const additionalPrice: AdditionalPrice = {
              price: priceGroup.price,
              productId: this.products[productIndex].id,
              additionalId: this.additionals[additionalIndex].id,
              serviceProviderId: this.installer.id
            };
            
            filledPrices.push(additionalPrice);
          }
        });
      });
  
      // Call the service to update or create prices
      this.pricesService.updatePrices(filledPrices).subscribe({
        next: (updatedPrices) => {
          this._snackBar.open('המחירון עודכן בהצלחה', 'Close', { duration: 3000 });
          // Optionally reset form or update local data
        },
        error: (err) => {
          this.errMessage = 'Failed to update prices. Please try again later.';
          this._snackBar.open(this.errMessage, 'Close', { duration: 3000 });
        }
      });
    } else {
      this.errMessage = 'Please check your form for errors.';
      this._snackBar.open(this.errMessage, 'Close', { duration: 3000 });
    }
  }
  }

