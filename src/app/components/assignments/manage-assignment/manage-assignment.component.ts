import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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

  additionalPrices: AdditionalPrice[];

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
    private additionalPriceService: AdditionalPriceService
  ) {
    super(accontsService);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.route.data.pipe(take(1)).subscribe((data) => {
      this.assignment = data['assigment'];

      if (this.assignment) this.editMode = true;
      this.initForm();
      this.isLoading = false;
    });
    this.handleFormChange();
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
    });
    this.onProduct();
    this.onServiceProvider();

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
          this.socket.sendMessage(res);
          this.snackbarService.openSnackBar('ההתקנה נוספה בהצלחה!');
          this.router.navigate(['/assignments']);
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
            this.socket.sendMessage(res);
            this.snackbarService.openSnackBar('ההתקנה עודנה בהצלחה!');
            this.router.navigate(['/assignments']);
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
        this.router.navigate(['/assignments']);
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
    cost = this.customerNeedsToPayControl.value - cost;
    return cost;
  }
}
