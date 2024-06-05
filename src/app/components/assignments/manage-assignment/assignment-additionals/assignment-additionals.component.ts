import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ServiceProviderPricing } from 'src/app/core/models/installerPricing.model';
import { Product } from 'src/app/core/models/product.model';
import { Option } from './../../../../core/models/option.model';
import { AdditionalsService } from './additionals.service';

export interface AdditionalsForm {
  hasInstallation: FormControl<boolean>;
  hasInnerFloor: FormControl<boolean>;
  hasOuterFloor: FormControl<boolean>;
  hasCarry: FormControl<boolean>;
}

@Component({
  selector: 'app-assignment-additionals',
  templateUrl: './assignment-additionals.component.html',
  styleUrls: ['./assignment-additionals.component.scss'],
})
export class AssignmentAdditionalsComponent implements OnInit {
  @Input() form: FormGroup;

  additionalsGroup: FormGroup<AdditionalsForm>;
  hasInnerFloorControl: FormControl<boolean>;
  hasOuterFloorControl: FormControl<boolean>;
  hasCarryControl: FormControl<boolean>;
  assignmentCostControl: FormControl<boolean>;
  hasInstallationControl: FormControl<boolean>;

  productControl: FormControl<Option<Product>>;

  customerNeedsToPay: FormControl;

  @Output() formReady = new EventEmitter<FormGroup<AdditionalsForm>>();

  constructor(private additionalsService: AdditionalsService) {}

  ngOnInit(): void {
    this.initForm();
    this.initFormBehaviors();

    this.additionalsService.additionals$.subscribe((additionals) => {
      this.hasCarryControl.setValue(additionals?.hasCarry, {
        emitEvent: false,
      });
      this.hasInnerFloorControl.setValue(additionals?.hasInnerFloor, {
        emitEvent: false,
      });
      this.hasOuterFloorControl.setValue(additionals?.hasOuterFloor, {
        emitEvent: false,
      });
      if (!additionals) {
        this.disableControls();
      }
    });

    this.formReady.emit(this.additionalsGroup);
  }

  initForm() {
    this.hasInnerFloorControl = new FormControl<boolean>(false);
    this.hasOuterFloorControl = new FormControl<boolean>(false);
    this.hasCarryControl = new FormControl<boolean>(false);
    this.hasInstallationControl = new FormControl<boolean>(false);

    this.additionalsGroup = new FormGroup({
      hasInnerFloor: this.hasInnerFloorControl,
      hasOuterFloor: this.hasOuterFloorControl,
      hasCarry: this.hasCarryControl,
      hasInstallation: this.hasInstallationControl,
    });
  }

  initFormBehaviors() {
    this.additionalsGroup.valueChanges.subscribe((additionals) => {
      this.additionalsService.setAdditionals({
        hasInnerFloor: additionals.hasInnerFloor,
        hasOuterFloor: additionals.hasOuterFloor,
        hasCarry: additionals.hasCarry,
        hasInstallation: additionals.hasInstallation,
      });
    });
  }

  disableControls() {
    this.hasInnerFloorControl?.disable({ emitEvent: false });
    this.hasOuterFloorControl?.disable({ emitEvent: false });
    this.hasCarryControl?.disable({ emitEvent: false });
  }

  handleAdditionalsChange(control: FormControl) {
    control.enable({ emitEvent: false });
  }

  resetControlsValues(value: boolean = false) {
    let controls = [
      this.hasInnerFloorControl,
      this.hasOuterFloorControl,
      this.hasCarryControl,
    ];
    controls.forEach((control) => {
      control.setValue(value, { emitEvent: false });
      control.enable({ emitEvent: false });
    });
  }
}
