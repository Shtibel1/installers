import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit, Optional, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { Status } from 'src/app/core/enums/status.enum';
import { AssignmentDto } from 'src/app/core/models/Dtos/assignmentDto.model';
import { Assignment } from 'src/app/core/models/assignment.model';
import { Marketer } from 'src/app/core/models/marketer.model';
import { Product } from 'src/app/core/models/product.model';
import { AssignmentsService } from 'src/app/core/services/assignments.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { BaseComponent } from '../../common/base/base.component';
import { Option } from './../../../core/models/option.model';
import { AssignmentAdditionalsComponent } from './assignment-additionals/assignment-additionals.component';
import {
  marketerToOption,
  productToOption,
  serviceProviderToOption,
} from './assignments.helper';
import { CustomerForm } from './manage-customer/manage-customer.component';
import { SelectServiceProviderComponent } from './selects/select-service-provider/select-service-provider.component';
import { AdditionalsService } from 'src/app/core/services/additionals.service';
import { AdditionalPrice } from 'src/app/core/models/additionalPrice.model';
import { ServiceProvider } from 'src/app/core/models/serviceProvider.model';
import { AdditionalPriceService } from 'src/app/core/services/additional-price.service';
import { PickupStatus } from 'src/app/core/enums/pickup-status.enum';
import { ServiceSuppliesService, ProductRequirementVm, ServiceProviderStockVm, StockAdjustmentVm } from 'src/app/core/services/service-products.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface AssignmentForm {
  createdDate: FormControl;
  serviceProvider: FormControl<Option<ServiceProvider> | null>;
  product: FormControl<Option<Product>>;
  customerNeedsToPay: FormControl;
  marketer: FormControl<Option<Marketer> | null>;
  comments: FormControl;
  customer?: FormGroup<CustomerForm>;
  status: FormControl<Status>;
  extras: FormControl;
  pickupStatus: FormControl<PickupStatus>;
  additionals?: FormGroup;
  numOfProducts: FormControl;
  affectStock: FormControl<boolean>;
}

@Component({
  selector: 'app-manage-assignment',
  templateUrl: './manage-assignment.component.html',
  styleUrls: ['./manage-assignment.component.scss'],
})
export class ManageAssignmentComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  editMode: boolean = false;
  errMessage: string;
  isLoading = false;
  private returnUrl?: string;

  assignmentForm: FormGroup<AssignmentForm>;
  dateControl: FormControl;
  marketerControl: FormControl<Option<Marketer> | null>;
  serviceProviderControl: FormControl<Option<ServiceProvider> | null>;
  productControl: FormControl<Option<Product> | null>;
  customerNeedsToPayControl: FormControl;
  commentsControl: FormControl<string | null>;
  status: FormControl<Status>;
  additionalsForm: FormGroup;
  customerControl: FormGroup<CustomerForm>;
  extrasControl: FormControl;
  pickupStatus: FormControl<PickupStatus>;
  numOfProductsControl: FormControl;
  affectStockControl: FormControl<boolean>;

  additionalPrices: AdditionalPrice[];
  productRequirements: ProductRequirementVm[] = [];
  stockInfo: { serviceProductId: string; serviceProductName: string; currentStock: number; afterStock: number; }[] = [];

  assignment: Assignment;
  cost: number;

  @ViewChild(SelectServiceProviderComponent)
  selectServiceProviderComponent: SelectServiceProviderComponent;

  @ViewChild(AssignmentAdditionalsComponent)
  additionalsComponent: AssignmentAdditionalsComponent;

  constructor(
    accontsService: AuthService,
    private assingmentsService: AssignmentsService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private socket: WebsocketService,
    private router: Router,
    private additionalPriceService: AdditionalPriceService,
    private serviceSuppliesService: ServiceSuppliesService,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData?: { assignmentId?: string },
    @Optional() private dialogRef?: MatDialogRef<ManageAssignmentComponent>
  ) {
    super(accontsService);
  }

  ngOnInit(): void {
    this.isLoading = true;
    // If opened as a dialog with an assignmentId, fetch and init for edit
  // capture returnUrl from query if present
  this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || undefined;
  if (this.dialogData?.assignmentId) {
      this.assingmentsService.getAssignment(this.dialogData.assignmentId)
        .pipe(take(1))
        .subscribe({
          next: (assignment) => {
            this.assignment = assignment;
            this.editMode = true;
            this.initForm();
            this.isLoading = false;
            this.handleFormChange();
          },
          error: () => {
            this.isLoading = false;
            this.errMessage = 'שגיאה בטעינת ההזמנה';
          },
        });
    } else {
      // Regular route-based flow
      this.route.data.pipe(take(1)).subscribe((data) => {
        this.assignment = data['assigment'];
        if (this.assignment) this.editMode = true;
        this.initForm();
        this.isLoading = false;
        this.handleFormChange();
      });
    }
  }

  ngAfterViewInit() {}

  initForm() {
    let createdDate = this.assignment?.createdDate || new Date();
    let serviceProvider = serviceProviderToOption(
      this.assignment?.serviceProvider
    );
    let product = productToOption(this.assignment?.product);
    let marketer = marketerToOption(this.assignment?.marketer);
    let comments = this.assignment?.comments.map((a) => a.content) || null;
    let customerNeedsToPay = this.assignment?.customerNeedsToPay || null;
    let status = this.assignment?.status || Status.new;
    let extras = this.assignment?.extras || null;
    let pickupStatus = this.assignment?.pickupStatus || PickupStatus.NotReady;
    let numOfProducts = this.assignment?.numOfProducts || 1;

    this.dateControl = new FormControl(createdDate, Validators.required);
    this.serviceProviderControl = new FormControl(serviceProvider, [
      Validators.required,
    ]);
    this.serviceProviderControl.setValue(serviceProvider);
    this.productControl = new FormControl(product, Validators.required);
    this.customerNeedsToPayControl = new FormControl(customerNeedsToPay);
    this.marketerControl = new FormControl(marketer);
    this.extrasControl = new FormControl(extras);
    this.pickupStatus = new FormControl(pickupStatus);
    this.commentsControl = new FormControl(comments?.[0]);
    this.status = new FormControl(status);
    this.numOfProductsControl = new FormControl(numOfProducts);
    this.affectStockControl = new FormControl(false);

    this.assignmentForm = new FormGroup({
      createdDate: this.dateControl,
      serviceProvider: this.serviceProviderControl,
      product: this.productControl,
      customerNeedsToPay: this.customerNeedsToPayControl,
      marketer: this.marketerControl,
      comments: this.commentsControl,
      status: this.status,
      extras: this.extrasControl,
      pickupStatus: this.pickupStatus,
      numOfProducts: this.numOfProductsControl,
      affectStock: this.affectStockControl,
    });
    this.onProduct();
    this.onServiceProvider();

    // Add listeners for stock-related changes
    this.affectStockControl.valueChanges.subscribe(() => {
      this.onAffectStockChange();
    });

    this.numOfProductsControl.valueChanges.subscribe(() => {
      this.onNumOfProductsChange();
    });

    if (product && serviceProvider) {
      this.getAdditionals(serviceProvider.value.id, product.value.id);
    }
  }

  onProduct() {
    this.productControl.valueChanges.subscribe((product) => {
      if (!product || !this.serviceProviderControl.value) return;
      this.getAdditionals(
        this.serviceProviderControl.value.value.id,
        product.value.id
      );
      // Update stock information when product or service provider changes
      this.updateStockInfo();
    });
  }

  onAdditionalsFormReady(additionalsForm: FormGroup) {
    //this.assignmentForm.addControl('additionals', additionalsForm);
    this.additionalsForm = additionalsForm;
    if (additionalsForm) {
      this.additionalsForm.valueChanges.subscribe((value) => {
        this.cost = this.calculateCost();
      });
    }
  }

  getAdditionals(serviceProviderId: string, productId: string) {
    this.additionalPriceService
      .getAdditionalPricesByProduct(serviceProviderId, productId)
      .subscribe((res) => {
        this.additionalPrices = res;
        setTimeout(() => {
          this.cost = this.calculateCost();
        }, 10);
      });
  }

  onServiceProvider() {
    this.serviceProviderControl.valueChanges.subscribe((value) => {
      this.productControl.reset();
      this.stockInfo = []; // Clear stock info when service provider changes
    });
  }

  handleFormChange() {
    this.assignmentForm.valueChanges.subscribe((value) => {
      this.cost = this.calculateCost();
    });
  }

  onCustomerFormReady(customerForm: FormGroup<CustomerForm>) {
    this.assignmentForm.addControl('customer', customerForm);
    this.customerControl = customerForm;
  }

  onSubmit() {
    if (!this.assignmentForm.valid) {
      this.assignmentForm.markAllAsTouched();
      return;
    }

    // Check for insufficient stock if affect stock is enabled and it's a new assignment
    if (!this.editMode && this.affectStockControl.value && this.hasInsufficientStock()) {
      this.snackbarService.openSnackBar('אין מספיק מלאי לביצוע ההתקנה. אנא בדוק את המלאי.');
      return;
    }

    let additionalPrices = this.additionalsComponent.getAdditionalPrices();

    let assignmentDate = this.assignment?.assignmentDate
      ? this.datePipe.transform(
          this.assignment.assignmentDate,
          'yyyy-MM-ddTHH:mm:ss'
        )
      : null;

    let assignmentDto: AssignmentDto = {
      id: this.assignment?.id || null,
      assignmentDate: assignmentDate,
      isPaid: this.assignment?.isPaid || false,
      productId: this.productControl.value.value.id,
      employeeId: this.user.id,
      serviceProviderId: this.serviceProviderControl.value.value.id,
      createdDate: this.datePipe.transform(
        this.dateControl.value,
        'yyyy-MM-ddTHH:mm:ss'
      ),
      customerNeedsToPay: this.customerNeedsToPayControl.value,
      customerAlreadyPaid: null,
      cost: this.cost,
      additionalPrices: [...additionalPrices],
      customer: {
        ...this.customerControl.value,
        id: this.assignment?.customer?.id || 0,
      },
      status: this.status.value,
      marketerId: this.marketerControl?.value?.value?.id || null,
      extras: +this.extrasControl.value,
      pickupStatus: this.pickupStatus.value,
      numOfProducts: this.numOfProductsControl.value,
    };

    if (this.commentsControl.value) {
      assignmentDto.comments = [
        {
          userId: this.user.id,
          content: this.commentsControl.value,
        },
      ];
    }

    if (!this.editMode) {
      this.assingmentsService.createAssignment(assignmentDto).subscribe({
        next: (res) => {
          // Update stock if the checkbox is checked
          if (this.affectStockControl.value) {
            this.updateProviderStock().then(() => {
              this.socket.sendMessage(res);
              this.snackbarService.openSnackBar('ההתקנה נוספה בהצלחה והמלאי עודכן!');
              if (this.dialogRef.close) {
                this.dialogRef.close(res);
              } else {
                this.navigateBack();
              }
            }).catch((error) => {
              console.error('Error updating stock:', error);
              this.socket.sendMessage(res);
              this.snackbarService.openSnackBar('ההתקנה נוספה אך עדכון המלאי נכשל');
              if (this.dialogRef.close) {
                this.dialogRef.close(res);
              } else {
                this.navigateBack();
              }
            });
          } else {
            this.socket.sendMessage(res);
            this.snackbarService.openSnackBar('ההתקנה נוספה בהצלחה!');
            if (this.dialogRef.close) {
              this.dialogRef.close(res);
            } else {
              this.navigateBack();
            }
          }
        },
        error: (err) => {
          this.errMessage = err;
        },
      });
    } else {
      assignmentDto.customer.id = null;
      this.assingmentsService
        .updateAssignment(this.assignment.id, assignmentDto)
        .subscribe({
          next: (res) => {
            // Update stock if the checkbox is checked (only for new installations, not edits)
            this.socket.sendMessage(res);
            this.snackbarService.openSnackBar('ההתקנה עודנה בהצלחה!');
            if (this.dialogRef.close) {
              this.dialogRef.close(res);
            } else {
              this.navigateBack();
            }
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
        this.snackbarService.openSnackBar('ההתקנה נמחקה בהצלחה!');
        if (this.dialogRef) {
          this.dialogRef.close({ deleted: true, id: this.assignment.id });
        } else {
          this.router.navigate(['/assignments']);
        }
      },
      error: (err) => {
        this.errMessage = err;
      },
    });
  }

  calculateCost() {
    let additionalPrices = this.additionalsComponent?.getAdditionalPrices();
    let cost = 0;
    additionalPrices?.forEach((price) => {
      cost += +price.price;
    });
    if (this.extrasControl.value) cost += +this.extrasControl.value;
    cost = cost * this.numOfProductsControl.value;
    cost = this.customerNeedsToPayControl.value - cost;
    return cost;
  }

  updateStockInfo() {
    if (!this.productControl.value || !this.serviceProviderControl.value) {
      this.stockInfo = [];
      return;
    }

    const productId = this.productControl.value.value.id;
    const serviceProviderId = this.serviceProviderControl.value.value.id;

    // Get product requirements
    this.serviceSuppliesService.getRequirements(productId).subscribe({
      next: (requirements) => {
        this.productRequirements = requirements;
        
        if (requirements.length > 0) {
          // Get current stock for each required service product
          this.loadStockInfo(serviceProviderId, requirements);
        } else {
          this.stockInfo = [];
        }
      },
      error: (error) => {
        console.error('Error loading product requirements:', error);
        this.stockInfo = [];
      }
    });
  }

  private loadStockInfo(serviceProviderId: string, requirements: ProductRequirementVm[]) {
    this.serviceSuppliesService.getProviderStock(serviceProviderId).subscribe({
      next: (stockItems) => {
        this.stockInfo = requirements.map(req => {
          const currentStockItem = stockItems.find(stock => stock.serviceProductId === req.serviceProductId);
          const currentStock = currentStockItem ? currentStockItem.amount : 0;
          const requiredQuantity = req.quantity * this.numOfProductsControl.value;
          const afterStock = currentStock - requiredQuantity;

          return {
            serviceProductId: req.serviceProductId,
            serviceProductName: req.serviceProductName || 'Unknown Product',
            currentStock: currentStock,
            afterStock: afterStock
          };
        });
      },
      error: (error) => {
        console.error('Error loading stock info:', error);
        this.stockInfo = [];
      }
    });
  }

  onAffectStockChange() {
    if (this.affectStockControl.value) {
      this.updateStockInfo();
    }
  }

  onNumOfProductsChange() {
    // Update stock calculations when number of products changes
    if (this.affectStockControl.value && this.productRequirements.length > 0) {
      const serviceProviderId = this.serviceProviderControl.value?.value.id;
      if (serviceProviderId) {
        this.loadStockInfo(serviceProviderId, this.productRequirements);
      }
    }
    // Recalculate cost
    this.cost = this.calculateCost();
  }

  hasInsufficientStock(): boolean {
    return this.stockInfo.some(item => item.afterStock < 0);
  }

  private async updateProviderStock(): Promise<void> {
    if (!this.productRequirements || this.productRequirements.length === 0) {
      return Promise.resolve();
    }

    const serviceProviderId = this.serviceProviderControl.value.value.id;
    const numOfProducts = this.numOfProductsControl.value;

    // Create stock adjustments for each required service product
    const stockAdjustments = this.productRequirements.map(req => ({
      serviceProviderIdExternal: serviceProviderId,
      serviceProductId: req.serviceProductId,
      delta: -(req.quantity * numOfProducts), // Negative because we're consuming stock
      reason: `התקנה - ${this.productControl.value.value.name} (כמות: ${numOfProducts})`,
      performedByUserId: this.user.id,
      referenceId: null // Could be assignment ID if needed
    }));

    // Execute all stock adjustments
    const adjustmentPromises = stockAdjustments.map(adjustment =>
      this.serviceSuppliesService.adjustStock(adjustment).toPromise()
    );

    try {
      await Promise.all(adjustmentPromises);
      console.log('Stock updated successfully for all products');
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  private navigateBack() {
    if (this.returnUrl) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.router.navigate(['/assignments']);
    }
  }
}
