import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/core/models/customer.model';

export interface CustomerForm {
  name: FormControl<string>;
  address: FormControl<string>;
  phone: FormControl<string>;
}

@Component({
  selector: 'app-manage-customer',
  templateUrl: './manage-customer.component.html',
  styleUrls: ['./manage-customer.component.scss'],
})
export class ManageCustomerComponent implements OnInit {
  @Input() customer?: Customer;
  customerForm: FormGroup<CustomerForm>;
  nameControl: FormControl;
  addressControl: FormControl;
  phoneControl: FormControl;

  @Output() formReady = new EventEmitter<FormGroup<CustomerForm>>();

  constructor() {}

  ngOnInit(): void {
    this.forminit();
    this.formReady.emit(this.customerForm);
  }

  forminit() {
    let name = this.customer?.name || null;
    let phone = this.customer?.phone || null;
    let address = this.customer?.address || null;

    this.nameControl = new FormControl(name, Validators.required);
    this.phoneControl = new FormControl(phone);
    this.addressControl = new FormControl(address);

    this.customerForm = new FormGroup({
      name: this.nameControl,
      phone: this.phoneControl,
      address: this.addressControl,
    });
  }

  onSubmit() {}
}
