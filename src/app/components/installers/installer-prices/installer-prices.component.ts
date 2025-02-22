import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { take, tap } from 'rxjs';
import { Installer } from 'src/app/core/models/installer.model';
import { InstallerPricing } from 'src/app/core/models/installerPricing.model';
import { Product } from 'src/app/core/models/product.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { InstallersPricesService } from 'src/app/core/services/installers-prices.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { WorkersService } from 'src/app/core/services/workers.service';
import { BaseComponent } from '../../common/base/base.component';
import { Role } from 'src/app/core/enums/roles.enum';

@Component({
  selector: 'app-installer-prices',
  templateUrl: './installer-prices.component.html',
  styleUrls: ['./installer-prices.component.scss'],
})
export class InstallerPricesComponent extends BaseComponent implements OnInit {
  installer: Installer;
  prodFormArray: FormArray;
  addPricesForm: FormGroup = new FormGroup({});
  products: Product[] = [];
  pricesArray: InstallerPricing[] = [];
  currentPrices: InstallerPricing[] = [];
  errMessage: any;

  constructor(
    private route: ActivatedRoute,
    private workersService: WorkersService,
    private productsService: ProductsService,
    private cdr: ChangeDetectorRef,
    private pricesService: InstallersPricesService,
    private _snackBar: MatSnackBar,
    authService: AuthService
  ) {
    super(authService);
  }

  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe((params) => {
      this.initInstaller(params).subscribe(() => {
        console.log(params['id']);
        this.pricesService
          .getPricesByInstaller(params['id'])
          .subscribe((prices) => {
            if (prices) this.currentPrices = prices;
            this.initProducts().subscribe(() => {
              this.addPricesForm = new FormGroup({});
              this.initForm();
            });
          });
      });
    });
  }

  onSubmit() {
    this.pricesArray = [];
    let groupsArr: FormGroup[] = <FormGroup[]>(
      (<FormArray>this.addPricesForm.get('prices')).controls
    );
    groupsArr.forEach((group) => {
      this.products.forEach((p) => {
        if (p.name === group.value.productName) {
          this.pricesArray.push({
            productId: p.id,
            ...group.value,
            installerId: this.installer.id,
          });
        }
      });
    });

    this.pricesService
      .updatePricesTable(this.installer.id, this.pricesArray)
      .subscribe({
        next: (res) => {
          this.openSnackBar('המחירים עודכנו בהצלחה!');
        },
        error: (err) => {
          this.errMessage = err;
        },
      });
  }

  initForm() {
    this.addPricesForm = new FormGroup({
      prices: this.createFormArray(),
    });
  }

  createFormArray(): FormArray {
    this.prodFormArray = new FormArray([]);

    for (let i = 0; i < this.products.length; i++) {
      let productName = this.products[i].name;
      let installationPrice = null;
      let outerFloorPrice = null;
      let innerFloorPrice = null;
      let carryPrice = null;

      this.currentPrices.forEach((prices) => {
        if (this.products[i].id === prices.productId) {
          productName = this.products[i].name;
          installationPrice = prices.installationPrice;
          outerFloorPrice = prices.outerFloorPrice;
          innerFloorPrice = prices.innerFloorPrice;
          carryPrice = prices.carryPrice;
        }
      });

      this.prodFormArray.controls.push(
        new FormGroup({
          productName: new FormControl(productName),
          installationPrice: new FormControl(installationPrice),
          outerFloorPrice: new FormControl(outerFloorPrice),
          innerFloorPrice: new FormControl(innerFloorPrice),
          carryPrice: new FormControl(carryPrice),
        })
      );
    }
    if (this.user.role == Role.ServiceProvider) {
      this.prodFormArray.disable();
    }
    return this.prodFormArray;
  }
  getFormArrayControls(): FormGroup[] {
    return <FormGroup[]>(<FormArray>this.addPricesForm.get('prices')).controls;
  }
  getFormGroupControl(formGroup: FormGroup, index: number) {
    return formGroup.controls[index];
  }

  initInstaller(params: Params) {
    return this.workersService.installersChain.pipe(
      tap((installers) => {
        if (!installers) {
          this.workersService.getInstallers().subscribe();
        } else {
          this.installer = installers.find(
            (ins) => ins.id.toString() == params['id']
          );
        }
      })
    );
  }

  initProducts() {
    return this.productsService.products$.pipe(
      tap((prds) => {
        if (!prds) {
          this.productsService.getProducts().subscribe();
        } else {
          this.products = [];
          prds.forEach((prd) => {
            //fix it
            this.installer?.categories.forEach((cat) => {
              if (cat.id === prd.category.id) {
                this.products.push(prd);
              }
            });
          });
          console.log(this.products);
        }
      })
    );
  }

  private openSnackBar(message: string) {
    this._snackBar.open(message, 'Ok', {
      duration: 5000,
    });
  }
}
