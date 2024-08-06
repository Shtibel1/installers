import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, startWith } from 'rxjs';
import { Assignment } from 'src/app/core/models/assignment.model';
import { AssignmentDto } from 'src/app/core/models/Dtos/assignmentDto.model';
import { Installer } from 'src/app/core/models/installer.model';
import { InstallerPricing } from 'src/app/core/models/installerPricing.model';
import { Product } from 'src/app/core/models/product.model';
import { AssignmentsService } from 'src/app/core/services/assignments.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { InstallersPricesService } from 'src/app/core/services/installers-prices.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { WorkersService } from 'src/app/core/services/workers.service';
import { BaseComponent } from '../../common/base/base.component';

@Component({
  selector: 'app-manage-assignment',
  templateUrl: './manage-assignment.component.html',
  styleUrls: ['./manage-assignment.component.scss'],
})
export class ManageAssignmentComponent extends BaseComponent implements OnInit {
  editMode: boolean = false;
  assignmentForm: FormGroup;
  errMessage: string;
  installers: Installer[] = null;
  selectedInstaller: Installer = null;
  filteredProductsOptions: Product[];
  pricesArray: InstallerPricing[] = [];
  pricesByProduct: InstallerPricing;
  selectedProduct: Product;
  productsByInstaller: any;
  customerForm: any;
  products: any;
  customerControl?: FormControl;

  constructor(
    private accontsService: AuthService,
    private _adapter: DateAdapter<any>,
    private productsService: ProductsService,
    private pricesService: InstallersPricesService,
    private workersService: WorkersService,
    private assingmentsService: AssignmentsService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public assignment: Assignment,
    private dialogRef: MatDialogRef<ManageAssignmentComponent>
  ) {
    super(accontsService);
  }

  ngOnInit(): void {
    this.editMode = !!this.assignment;
    this._adapter.setLocale('il');
    this.forminit();
    this.getInstallers();
    this.getProducts();

    this.assignmentForm
      .get('product')
      .valueChanges.pipe(
        startWith(''),
        map((value) => value)
      )
      .subscribe((value) => (this.filteredProductsOptions = value));
  }

  onSubmit() {
    let assignmentDto: AssignmentDto = {
      id: this.assignment.id || 0,
      productId: this.selectedProduct.id,
      managerId: this.user.id,
      installerId: this.selectedInstaller.id,
      date: this.assignmentForm.value.date,
      customerPrice: this.assignmentForm.value.customerPrice,
      totalPrice: this.assignmentForm.value.totalPrice,
      installationPrice: this.assignmentForm.get('installationPrice').value,
      innerFloorPrice: this.assignmentForm.get('innerFloorPrice').value,
      outerFloorPrice: this.assignmentForm.get('outerFloorPrice').value,
      carryPrice: this.assignmentForm.get('carryPrice').value,
      customer: { ...this.customerForm.value },
      comments: null,
      status: 'פתוח',
    };

    if (
      this.assignmentForm.get('comments').value != '' &&
      this.assignmentForm.get('comments').value !== null
    ) {
      assignmentDto.comments = [];
      assignmentDto.comments.push({
        userId: this.user.id,
        content: this.assignmentForm.get('comments').value,
      });
    }

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
        .patchAssignment(
          this.assignment.id,
          this.getChangedFields(assignmentDto)
        )
        .subscribe({
          next: (res) => {
            this.openSnackBar('ההתקנה עודנה בהצלחה!');
            this.dialogRef.close();
          },
          error: (err) => {
            console.log(err);
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

  onInstaller(installer: Installer, event: any) {
    if (event.isUserInput) {
      this.selectedInstaller = installer;
      this.pricesService
        .getPricesByInstaller(installer.id)
        .subscribe((prices) => {
          this.pricesArray = prices;
          this.updateProductsByInstaller(installer);
          this.assignmentForm.get('product').enable();
        });
    }
  }

  updateProductsByInstaller(installer) {
    this.productsByInstaller = this.productsService.getProductsByCategories(
      installer.categories
    );

    let arr = [];
    this.pricesArray.forEach((prices) => {
      this.productsByInstaller.forEach((p) => {
        if (prices.productId == p.id && prices.installationPrice > 0) {
          arr.push(p);
        }
      });
    });
    this.productsByInstaller = arr;
    this.filteredProductsOptions = this.productsByInstaller;
  }

  // onProduct(product: Product, event: any) {
  //   if (event.isUserInput) {
  //     this.pricesArray.forEach((prices) => {
  //       if (prices.productId === product.id) {
  //         this.pricesByProduct = prices;
  //       }
  //     });
  //     this.assignmentForm.controls['customerPrice'].patchValue(
  //       product.customerInstallationPrice
  //     );
  //     this.assignmentForm.controls['installationPrice'].patchValue(
  //       this.pricesByProduct?.installationPrice || null
  //     );
  //     this.assignmentForm.controls['totalPrice'].patchValue(
  //       this.pricesByProduct?.installationPrice || null
  //     );
  //     this.assignmentForm.get('innerFloorPrice').patchValue(null);
  //     this.assignmentForm.get('outerFloorPrice').patchValue(null);
  //     this.assignmentForm.get('carryPrice').patchValue(null);
  //     this.selectedProduct = product;
  //   }
  // }

  forminit() {
    let createdDate = this.assignment?.createdDate || new Date();
    let customer = this.assignment?.customer || null;
    let installer = this.assignment?.installer || null;
    let product = this.assignment?.product || null; //export
    let customerNeedsToPay = this.assignment?.customerNeedsToPay || null;
    let totalPrice = this.assignment?.totalPrice || null;
    let carryPrice = this.assignment?.carryPrice || null;
    this.selectedInstaller = installer;
    this.selectedProduct = product;

    this.customerControl = new FormControl(customer, Validators.required);

    this.assignmentForm = new FormGroup({
      createdDate: new FormControl(createdDate, Validators.required),
      installer: new FormControl(installer?.name, Validators.required),
      customer: this.customerControl,
      product: new FormControl<Product>(product, Validators.required),
      customerNeedsToPay: new FormControl(
        customerNeedsToPay,
        Validators.required
      ),
      totalPrice: new FormControl(totalPrice, Validators.required),
      carryPrice: new FormControl({ value: carryPrice, disabled: true }),
    });
  }

  private filter(value: string): Product[] {
    const filterValue = value.toLowerCase();
    let productsName: Product[] = [];
    this.productsByInstaller.forEach((p) => {
      if (p.name.toLowerCase().includes(filterValue)) {
        productsName.push(p);
      }
    });
    return productsName;
  }

  getInstallers() {
    this.workersService.installersChain.subscribe((installers) => {
      if (!installers) {
        this.workersService.getInstallers().subscribe();
      } else {
        this.installers = installers;
      }
    });
    this.assignmentForm.get('date');
  }

  getProducts() {
    this.productsService.products$.subscribe((prds) => {
      if (!prds) {
        this.productsService.getProducts().subscribe();
      } else {
        this.products = prds;
        this.productsByInstaller = prds;
        this.filteredProductsOptions = prds;
      }
    });
  }

  onInnerFloor(selected: boolean) {
    if (selected) {
      this.assignmentForm.controls['totalPrice'].patchValue(
        this.assignmentForm.controls['totalPrice'].value +
          this.pricesByProduct.innerFloorPrice
      );
      return this.assignmentForm
        .get('innerFloorPrice')
        .patchValue(this.pricesByProduct.innerFloorPrice);
    }
    this.assignmentForm.controls['totalPrice'].patchValue(
      this.assignmentForm.controls['totalPrice'].value -
        this.pricesByProduct.innerFloorPrice
    );
    return this.assignmentForm.get('innerFloorPrice').patchValue(0);
  }
  onOuterFloor(selected: boolean) {
    if (selected) {
      this.assignmentForm.controls['totalPrice'].patchValue(
        this.assignmentForm.controls['totalPrice'].value +
          this.pricesByProduct.outerFloorPrice
      );
      return this.assignmentForm
        .get('outerFloorPrice')
        .patchValue(this.pricesByProduct.outerFloorPrice);
    }
    this.assignmentForm.controls['totalPrice'].patchValue(
      this.assignmentForm.controls['totalPrice'].value -
        this.pricesByProduct.outerFloorPrice
    );
    return this.assignmentForm.get('outerFloorPrice').patchValue(0);
  }
  onCarry(selected: boolean) {
    if (selected) {
      this.assignmentForm.controls['totalPrice'].patchValue(
        this.assignmentForm.controls['totalPrice'].value +
          this.pricesByProduct.carryPrice
      );
      return this.assignmentForm
        .get('carryPrice')
        .patchValue(this.pricesByProduct.carryPrice);
    }
    this.assignmentForm.controls['totalPrice'].patchValue(
      this.assignmentForm.controls['totalPrice'].value -
        this.pricesByProduct.carryPrice
    );
    return this.assignmentForm.get('carryPrice').patchValue(0);
  }

  getDateControl() {
    return this.assignmentForm.get('createdDate') as FormControl;
  }

  private openSnackBar(message: string) {
    this._snackBar.open(message, 'Ok', {
      duration: 3000,
    });
  }

  getChangedFields(assignmentDto: AssignmentDto): string[][] {
    const paths: string[] = [];
    const values: string[] = [];

    Object.keys(assignmentDto.customer).forEach((field) => {
      if (
        this.assignment.customer.hasOwnProperty(field) &&
        assignmentDto.customer[field] !== this.assignment.customer[field]
      ) {
        paths.push(`/customer/${field}`);
        values.push(assignmentDto.customer[field]);
        this.assignment.customer[field] = assignmentDto.customer[field];
      }
    });

    if (assignmentDto.comments && assignmentDto.comments.length > 0) {
      paths.push(`/comments/content`);
      values.push(assignmentDto.comments[0].content);
    }

    Object.keys(assignmentDto).forEach((field) => {
      if (
        this.assignment.hasOwnProperty(field) &&
        assignmentDto[field] !== this.assignment[field]
      ) {
        paths.push(`/${field}`);
        values.push(assignmentDto[field]);
        this.assignment[field] = assignmentDto[field];
      }
    });

    const index = this.assingmentsService.assignmentsChain.value.findIndex(
      (a) => a.id == this.assignment.id
    );
    const array = this.assingmentsService.assignmentsChain.value;
    array[index] = this.assignment;
    this.assingmentsService.assignmentsChain.next(array);
    return [paths, values];
  }
}
