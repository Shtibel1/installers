import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { Status } from 'src/app/core/enums/status.enum';
import { AssignmentDto } from 'src/app/core/models/Dtos/assignmentDto.model';
import { Assignment } from 'src/app/core/models/assignment.model';
import { ServiceProvider } from 'src/app/core/models/installer.model';
import { Marketer } from 'src/app/core/models/marketer.model';
import { Product } from 'src/app/core/models/product.model';
import { AssignmentsService } from 'src/app/core/services/assignments.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { BaseComponent } from '../../common/base/base.component';
import { Option } from './../../../core/models/option.model';
import { AdditionalsService } from './assignment-additionals/additionals.service';
import {
  AdditionalsForm,
  AssignmentAdditionalsComponent,
} from './assignment-additionals/assignment-additionals.component';
import {
  marketerToOption,
  productToOption,
  serviceProviderToOption,
} from './assignments.helper';
import { CustomerForm } from './manage-customer/manage-customer.component';
import { SelectServiceProviderComponent } from './selects/select-service-provider/select-service-provider.component';

export interface AssignmentForm {
  createdDate: FormControl;
  installer: FormControl<Option<ServiceProvider> | null>;
  product: FormControl<Option<Product>>;
  customerNeedsToPay: FormControl;
  marketer: FormControl<Option<Marketer> | null>;
  comments: FormControl;
  customer?: FormGroup<CustomerForm>;
  status: FormControl<Status>;
}

@Component({
  selector: 'app-manage-assignment',
  templateUrl: './manage-assignment.component.html',
  styleUrls: ['./manage-assignment.component.scss'],
  providers: [AdditionalsService],
})
export class ManageAssignmentComponent extends BaseComponent implements OnInit {
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
  additionalsForm: FormGroup<AdditionalsForm>;
  customerControl: FormGroup<CustomerForm>;

  assignment: Assignment;

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
    private additionalsService: AdditionalsService
  ) {
    super(accontsService);
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.route.data.pipe(take(1)).subscribe((data) => {
      this.assignment = data['assigment'];

      if (this.assignment) {
        this.editMode = true;
      }
      this.forminit();

      this.isLoading = false;
    });
  }

  forminit() {
    let createdDate = this.assignment?.createdDate || new Date();
    let installer = serviceProviderToOption(this.assignment?.serviceProvider);
    let product = productToOption(this.assignment?.product);
    let customerNeedsToPay = this.assignment?.customerNeedsToPay || null;
    let marketer = marketerToOption(this.assignment?.marketer);
    let comments = this.assignment?.comments.map((a) => a.content) || null;
    let status = this.assignment?.status || Status.new;

    this.dateControl = new FormControl(createdDate, Validators.required);
    this.serviceProviderControl = new FormControl(installer, [
      Validators.required,
    ]);
    this.serviceProviderControl.setValue(installer);
    this.productControl = new FormControl(product, Validators.required);
    this.customerNeedsToPayControl = new FormControl(customerNeedsToPay);
    this.marketerControl = new FormControl(marketer);

    this.commentsControl = new FormControl(comments?.[0]);
    this.status = new FormControl(status);

    this.assignmentForm = new FormGroup({
      createdDate: this.dateControl,
      installer: this.serviceProviderControl,
      product: this.productControl,
      customerNeedsToPay: this.customerNeedsToPayControl,
      marketer: this.marketerControl,
      comments: this.commentsControl,
      status: this.status,
    });

    this.additionalsService.setAdditionals({
      hasCarry: this.assignment?.carryPrice > 0,
      hasInnerFloor: this.assignment?.innerFloorPrice > 0,
      hasOuterFloor: this.assignment?.outerFloorPrice > 0,
      hasInstallation: this.assignment?.installationPrice > 0,
    });

    this.onProduct();
  }

  onProduct() {
    this.productControl.valueChanges.subscribe((product) => {
      this.serviceProviderControl.setValue(null);
      if (!product || !product.value) {
        this.additionalsComponent.disableControls();
      } else {
        this.additionalsComponent.resetControlsValues();
      }
    });
  }

  onAdditionalsFormReady(form: FormGroup<AdditionalsForm>) {
    this.additionalsForm = form;
  }

  onCustomerFormReady(customerForm: FormGroup<CustomerForm>) {
    this.assignmentForm.addControl('customer', customerForm);
    this.customerControl = customerForm;
  }

  onSubmit() {
    console.log(this.marketerControl?.value?.value?.id || null);
    if (!this.assignmentForm.valid) {
      this.assignmentForm.markAllAsTouched();

      return;
    }

    const prices = this.selectServiceProviderComponent.getAdditionalsPrices();

    let assignmentDto: AssignmentDto = {
      id: this.assignment?.id || null,
      productId: this.productControl.value.value.id,
      employeeId: this.user.id,
      serviceProviderId: this.serviceProviderControl.value.value.id,
      date: this.datePipe.transform(
        this.dateControl.value,
        'yyyy-MM-ddTHH:mm:ss'
      ),
      customerNeedsToPay: this.customerNeedsToPayControl.value,
      customerAlreadyPaid: null,
      assignmentCost: +this.serviceProviderControl?.value?.price,
      installationPrice: prices.installationPrice,
      innerFloorPrice: prices.innerFloorPrice,
      outerFloorPrice: prices.outerFloorPrice,
      carryPrice: prices.carryPrice,
      customer: {
        ...this.customerControl.value,
        id: this.assignment?.customer?.id || 0,
      },
      comments: [
        {
          userId: this.user.id,
          content: this.commentsControl.value,
        },
      ],
      status: this.status.value,
      marketerId: this.marketerControl?.value?.value?.id || null,
    };

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
      assignmentDto.comments = this.assignment.comments;
      assignmentDto.pickupStatus = this.assignment.pickupStatus;
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
}

// updateProductsByInstaller(installer: ServiceProvider) {
//   this.productsByInstaller =
//     this.productsService.getProductsByInstaller(installer);

//   this.filteredProductsOptions = this.productsByInstaller.map((product) => {
//     return { label: product.name, value: product };
//   });
// }

// updatePricesByProduct(product: Product) {
//   return this.pricesService
//     .getInstallerPrice(
//       this.assignment?.serviceProvider?.id ??
//         this.installerControl.value.value.id,
//       product.id
//     )
//     .pipe(
//       tap((price) => {
//         this.pricesByProduct = price;
//       })
//     );
// }
