import { Assignment } from 'src/app/core/models/assignment.model';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Form, FormArray, FormControl, FormGroup } from '@angular/forms';
import { AssignmentForm } from 'src/app/components/assignments/manage-assignment/manage-assignment.component';
import { Option } from './../../../../core/models/option.model';
import { ServiceProviderPricing } from 'src/app/core/models/installerPricing.model';
import { Product } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-assignment-additionals',
  templateUrl: './assignment-additionals.component.html',
  styleUrls: ['./assignment-additionals.component.scss'],
})
export class AssignmentAdditionalsComponent implements OnInit, OnChanges {
  @Input() form: FormGroup;
  @Input() pricesByProduct?: ServiceProviderPricing;
  hasInnerFloorControl: FormControl;
  hasOuterFloorControl: FormControl;
  hasCarryControl: FormControl;
  assignmentCostControl: FormControl;

  productControl: FormControl<Option<Product>>;

  customerNeedsToPay: FormControl;

  constructor() {}

  ngOnInit(): void {
    this.initForm();
    this.initFormBehaviors();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pricesByProduct'] || changes['form']) {
      if (!this.pricesByProduct) {
        this.disableControls();
      } else {
        this.pricesByProduct.carryPrice
          ? this.handleAdditionalsChange(this.hasCarryControl)
          : this.hasCarryControl.disable({ emitEvent: false });
        this.pricesByProduct.innerFloorPrice
          ? this.handleAdditionalsChange(this.hasInnerFloorControl)
          : this.hasInnerFloorControl.disable({ emitEvent: false });
        this.pricesByProduct.outerFloorPrice
          ? this.handleAdditionalsChange(this.hasOuterFloorControl)
          : this.hasOuterFloorControl.disable({ emitEvent: false });
      }
    }
  }

  initForm() {
    this.hasInnerFloorControl = this.form.get('hasInnerFloor') as FormControl;
    this.hasOuterFloorControl = this.form.get('hasOuterFloor') as FormControl;
    this.hasCarryControl = this.form.get('hasCarry') as FormControl;
    this.productControl = this.form.get('product') as FormControl;

    this.customerNeedsToPay = this.form.get(
      'customerNeedsToPay'
    ) as FormControl;

    this.assignmentCostControl = this.form.get('assignmentCost') as FormControl;

    if (!this.productControl.value) {
      this.disableControls();
    }
  }

  initFormBehaviors() {
    this.hasInnerFloorControl.valueChanges.subscribe((value) => {
      console.log('value', value);
      console.log('this.pricesByProduct', this.pricesByProduct);
      if (value) {
        this.setCostsValues(true, this.pricesByProduct?.innerFloorPrice);
      } else {
        this.setCostsValues(false, this.pricesByProduct?.innerFloorPrice);
      }
    });

    this.hasOuterFloorControl.valueChanges.subscribe((value) => {
      if (value) {
        this.setCostsValues(true, this.pricesByProduct?.outerFloorPrice);
      } else {
        this.setCostsValues(false, this.pricesByProduct?.outerFloorPrice);
      }
    });

    this.hasCarryControl.valueChanges.subscribe((value) => {
      if (value) {
        this.setCostsValues(true, this.pricesByProduct?.carryPrice);
      } else {
        this.setCostsValues(false, this.pricesByProduct?.carryPrice);
      }
    });

    this.productControl.valueChanges.subscribe((value) => {
      if (!value) {
        this.disableControls();
      } else {
        this.setControlsValues(
          [
            this.hasCarryControl,
            this.hasInnerFloorControl,
            this.hasOuterFloorControl,
          ],
          false
        );
      }
    });
  }

  private setCostsValues(add: boolean, price?: number) {
    if (add) {
      this.customerNeedsToPay.setValue(
        this.customerNeedsToPay.value + price || 0
      );
      this.assignmentCostControl.setValue(
        this.assignmentCostControl.value + price || 0
      );
    } else {
      this.customerNeedsToPay.setValue(
        this.customerNeedsToPay.value - price || 0
      );
      this.assignmentCostControl.setValue(
        this.assignmentCostControl.value - price || 0
      );
    }
  }

  disableControls() {
    this.hasInnerFloorControl?.disable({ emitEvent: false });
    this.hasOuterFloorControl?.disable({ emitEvent: false });
    this.hasCarryControl?.disable({ emitEvent: false });
  }

  handleAdditionalsChange(control: FormControl) {
    control.enable({ emitEvent: false });
  }

  setControlsValues(controls: FormControl[], value: boolean) {
    controls.forEach((control) => {
      control.setValue(value, { emitEvent: false });
    });
  }
}
