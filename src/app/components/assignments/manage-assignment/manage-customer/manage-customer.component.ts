import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { startWith, map } from 'rxjs';
import { MyTel } from 'src/app/components/common/phone-input/phone-input.component';
import { Customer } from 'src/app/core/models/customer.model';

@Component({
  selector: 'app-manage-customer',
  templateUrl: './manage-customer.component.html',
  styleUrls: ['./manage-customer.component.scss'],
})
export class ManageCustomerComponent implements OnInit {
  @Input() control?: FormControl;
  customer?: Customer;
  customerForm: FormGroup;
  nameControl: FormControl;
  addressControl: FormControl;
  phoneControl: FormControl;
  phone: string;

  constructor() {}

  ngOnInit(): void {
    this.customer = this.control.value;
    this.forminit();
  }

  onSubmit() {
    let phoneRef = this.customerForm.value.phone;
    if (phoneRef) {
      this.phone = phoneRef.area + phoneRef.exchange + phoneRef.subscriber;
    }
    this.customerForm.value.phone = this.phone;

    let customer: Customer = { ...this.customerForm.value };
  }

  forminit() {
    this.phone = this.customer?.phone || null;
    let name = this.customer?.name || null;
    let phone = this.customer?.phone || null;
    let address = this.customer?.address || null;

    this.nameControl = new FormControl(name, Validators.required);
    this.phoneControl = new FormControl(address);
    this.addressControl = new FormControl(
      phone
        ? new MyTel(phone.slice(0, 3), phone.slice(3, 6), phone.slice(6, 10))
        : null,
      Validators.required
    );

    this.customerForm = new FormGroup({
      nameControl: this.nameControl,
      phoneControl: this.phoneControl,
      addressControl: this.addressControl,
    });
  }

  // getChangedFields(assignmentDto: AssignmentDto): string[][] {
  //   const paths: string[] = [];
  //   const values: string[] = [];

  //   Object.keys(assignmentDto.customer).forEach((field) => {
  //     if (
  //       this.customer.hasOwnProperty(field) &&
  //       assignmentDto.customer[field] !== this.customer[field]
  //     ) {
  //       paths.push(`/customer/${field}`);
  //       values.push(assignmentDto.customer[field]);
  //       this.customer[field] = assignmentDto.customer[field];
  //     }
  //   });

  //   if (assignmentDto.comments && assignmentDto.comments.length > 0) {
  //     paths.push(`/comments/content`);
  //     values.push(assignmentDto.comments[0].content);
  //   }

  //   const index = this.assingmentsService.assignmentsChain.value.findIndex(
  //     (a) => a.id == this.assignment.id
  //   );
  //   const array = this.assingmentsService.assignmentsChain.value;
  //   array[index] = this.assignment;
  //   this.assingmentsService.assignmentsChain.next(array);
  //   return [paths, values];
  // }
}
