import { CategoriesService } from './../../../core/services/categories.service';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignmentDto } from 'src/app/core/models/Dtos/assignmentDto.model';
import { Assignment } from 'src/app/core/models/assignment.model';
import { Installer } from 'src/app/core/models/installer.model';
import { InstallerPricing } from 'src/app/core/models/installerPricing.model';
import { Product } from 'src/app/core/models/product.model';
import { AssignmentsService } from 'src/app/core/services/assignments.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { InstallersPricesService } from 'src/app/core/services/installers-prices.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { WorkersService } from 'src/app/core/services/workers.service';
import { BaseComponent } from '../../common/base/base.component';
import { Option } from './../../../core/models/option.model';
import { CustomerForm } from './manage-customer/manage-customer.component';
import { workerToOption } from 'src/app/core/helpers/workerToOption';
import { updateDisabledControlValue } from 'src/app/core/helpers/updateDisabledControlValue';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  Observable,
  combineLatest,
  filter,
  forkJoin,
  map,
  take,
  tap,
} from 'rxjs';

export interface AssignmentForm {
  createdDate: FormControl;
  installer: FormControl<Option<Installer>>;
  product: FormControl<Option<Product>>;
  customerNeedsToPay: FormControl;
  assignmentCost: FormControl;
  carryPrice: FormControl;
  hasInnerFloor: FormControl;
  hasOuterFloor: FormControl;
  hasCarry: FormControl;
}

@Component({
  selector: 'app-manage-assignment',
  templateUrl: './manage-assignment.component.html',
  styleUrls: ['./manage-assignment.component.scss'],
})
export class ManageAssignmentComponent extends BaseComponent implements OnInit {
  editMode: boolean = false;
  assignmentForm: FormGroup;
  errMessage: string;
  installersOptions: Option<Installer>[];
  filteredProductsOptions: Option<Product>[];
  pricesArray: InstallerPricing[] = [];
  pricesByProduct: InstallerPricing;
  selectedProduct: Product;
  productsByInstaller: Product[];
  productsOptions: Option<Product>[] = [];

  dateControl: FormControl;
  installerControl: FormControl<Option<Installer>>;
  productControl: FormControl<Option<Product> | null>;
  customerNeedsToPayControl: FormControl;
  assignmentCostControl: FormControl;
  hasInnerFloorControl: FormControl;
  hasOuterFloorControl: FormControl;
  hasCarryControl: FormControl;

  isLoading = false;

  customerControl: FormGroup<CustomerForm>;

  constructor(
    accontsService: AuthService,
    private productsService: ProductsService,
    private pricesService: InstallersPricesService,
    private workersService: WorkersService,
    private assingmentsService: AssignmentsService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ManageAssignmentComponent>,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public assignment?: Assignment
  ) {
    super(accontsService);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.route.data.pipe(take(1)).subscribe((data) => {
      this.assignment = data['assigment'];

      if (this.assignment) {
        this.getProducts();
        this.updateProductsByInstaller(this.assignment.installer);
        this.updatePricesByProduct(this.assignment.product).subscribe();
        this.editMode = true;
      }
      this.getInstallers();
      this.forminit();
      this.initFormBehavior();
      this.isLoading = false;
    });
  }

  forminit() {
    let createdDate = this.assignment?.createdDate || new Date();
    let installer = this.assignment?.installer
      ? {
          label: this.assignment.installer.name,
          value: this.assignment.installer,
        }
      : null;
    let product = this.assignment?.product
      ? { label: this.assignment.product.name, value: this.assignment.product }
      : null; //export
    let customerNeedsToPay = this.assignment?.customerNeedsToPay || null;
    let assignmentCost = this.assignment?.assignmentCost || null;
    this.selectedProduct = product?.value;

    this.dateControl = new FormControl(createdDate, Validators.required);
    this.installerControl = new FormControl(installer, Validators.required);
    this.productControl = new FormControl(product, Validators.required);
    this.customerNeedsToPayControl = new FormControl(
      customerNeedsToPay,
      Validators.required
    );
    this.assignmentCostControl = new FormControl({
      value: assignmentCost,
      disabled: true,
    });

    let innerFloorPrice = !!this.assignment?.innerFloorPrice || null;
    let outerFloorPrice = !!this.assignment?.outerFloorPrice || null;
    let carryPrice = !!this.assignment?.carryPrice || null;

    this.hasInnerFloorControl = new FormControl(innerFloorPrice);
    this.hasOuterFloorControl = new FormControl(outerFloorPrice);
    this.hasCarryControl = new FormControl(carryPrice);

    this.assignmentForm = new FormGroup({
      createdDate: this.dateControl,
      installer: this.installerControl,
      product: this.productControl,
      customerNeedsToPay: this.customerNeedsToPayControl,
      assignmentCost: this.assignmentCostControl,
      hasInnerFloor: this.hasInnerFloorControl,
      hasOuterFloor: this.hasOuterFloorControl,
      hasCarry: this.hasCarryControl,
    });
  }

  onCustomerFormReady(customerForm: FormGroup<CustomerForm>) {
    this.assignmentForm.addControl('customer', customerForm);
    this.customerControl = customerForm;
  }

  initFormBehavior() {
    this.installerControl.valueChanges.subscribe(
      (installerOpt: Option<Installer>) => {
        if (!installerOpt) {
          return;
        }
        this.resetControlsOnInstaller();
        this.updateProductsByInstaller(installerOpt.value);
      }
    );

    this.productControl.valueChanges.subscribe(
      (productOpt: Option<Product> | string | null) => {
        if (!productOpt || typeof productOpt === 'string') {
          return;
        }
        let product = productOpt.value;
        this.updatePricesByProduct(product).subscribe(
          (installerProductPrice) => {
            console.log('installerProductPrice', installerProductPrice);
            this.assignmentCostControl.patchValue(
              installerProductPrice.installationPrice
            );
          }
        );
        this.customerNeedsToPayControl.patchValue(
          product.customerInstallationPrice
        );

        // updateDisabledControlValue(this.hasInnerFloorControl, false);
        // updateDisabledControlValue(this.hasOuterFloorControl, false);
        // updateDisabledControlValue(this.hasCarryControl, false);
      }
    );
  }

  getPricesByInstallerProduct(installer: Installer) {
    return this.pricesService.getPricesByInstaller(installer.id).pipe(
      tap((prices) => {
        this.pricesArray = prices;
        this.updateProductsByInstaller(installer);
      })
    );
  }

  updatePricesByProduct(product: Product) {
    return this.pricesService
      .getInstallerPrice(
        this.assignment?.installer?.id ?? this.installerControl.value.value.id,
        product.id
      )
      .pipe(
        tap((price) => {
          this.pricesByProduct = price;
        })
      );
  }

  resetControlsOnInstaller() {
    this.productControl?.reset(null, { emitEvent: false });
    this.assignmentCostControl.reset(null, { emitEvent: false });
    this.customerNeedsToPayControl.reset(null, { emitEvent: false });
    this.hasInnerFloorControl.reset(false, { emitEvent: false });
    this.hasOuterFloorControl.reset(false, { emitEvent: false });
    this.hasCarryControl.reset(false, { emitEvent: false });
    this.pricesByProduct = null;
  }

  updateProductsByInstaller(installer: Installer) {
    this.productsByInstaller =
      this.productsService.getProductsByInstaller(installer);

    this.filteredProductsOptions = this.productsByInstaller.map((product) => {
      return { label: product.name, value: product };
    });
  }

  getInstallers(): void {
    this.workersService.getInstallers().subscribe((installers) => {
      this.installersOptions = installers.map((installer) => {
        return { label: installer.name, value: installer };
      });
    });
  }

  getProducts(): Observable<Product[]> {
    return this.productsService.getProducts().pipe(
      tap((products) => {
        this.productsOptions = products.map((product) => {
          return { label: product.name, value: product };
        });
      })
    );
  }

  private openSnackBar(message: string) {
    this._snackBar.open(message, 'Ok', {
      duration: 3000,
    });
  }

  onSubmit() {
    if (!this.assignmentForm.valid) {
      this.assignmentForm.markAllAsTouched();
      return;
    }

    let assignmentDto: AssignmentDto = {
      id: this.assignment?.id || 0,
      productId: this.productControl.value.value.id,
      managerId: this.user.id,
      installerId: this.installerControl.value.value.id,
      date: this.datePipe.transform(
        this.dateControl.value,
        'yyyy-MM-ddTHH:mm:ss'
      ),
      customerNeedsToPay: this.customerNeedsToPayControl.value,
      customerAlreadyPaid: 0,
      assignmentCost: this.assignmentCostControl.value,
      installationPrice: this.pricesByProduct.installationPrice,
      innerFloorPrice: this.hasInnerFloorControl.value
        ? this.pricesByProduct.innerFloorPrice
        : 0,
      outerFloorPrice: this.hasOuterFloorControl.value
        ? this.pricesByProduct.outerFloorPrice
        : 0,
      carryPrice: this.hasCarryControl.value
        ? this.pricesByProduct.carryPrice
        : 0,
      customer: {
        ...this.customerControl.value,
        id: this.assignment?.customer?.id || 0,
      },
      comments: null,
      status: 'פתוח',
    };

    // if (
    //   this.assignmentForm.get('comments').value != '' &&
    //   this.assignmentForm.get('comments').value !== null
    // ) {
    //   assignmentDto.comments = [];
    //   assignmentDto.comments.push({
    //     userId: this.user.id,
    //     content: this.assignmentForm.get('comments').value,
    //   });
    // }

    if (!this.editMode) {
      this.assingmentsService.createAssignment(assignmentDto).subscribe({
        next: (res) => {
          this.openSnackBar('ההתקנה נוספה בהצלחה!');
          this.dialogRef.close();
        },
        error: (err) => {
          this.errMessage = err;
        },
      });
    } else {
      this.assingmentsService
        .updateAssignment(this.assignment.id, assignmentDto)
        .subscribe({
          next: (res) => {
            this.openSnackBar('ההתקנה עודנה בהצלחה!');
            this.dialogRef.close();
          },
          error: (err) => {
            this.errMessage = err;
          },
        });
    }
  }

  onDelete() {
    this.assingmentsService.deleteAssignment(this.assignment.id).subscribe({
      next: (res) => {
        this.openSnackBar('ההתקנה נמחקה בהצלחה!');
        this.dialogRef.close();
      },
      error: (err) => {
        this.errMessage = err;
      },
    });
  }
}
