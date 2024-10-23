import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { AdditionalPrice } from 'src/app/core/models/additionalPrice.model';
import { Product } from 'src/app/core/models/product.model';
import { Option } from './../../../../core/models/option.model';
import { AdditionalsService } from 'src/app/core/services/additionals.service';


@Component({
  selector: 'app-assignment-additionals',
  templateUrl: './assignment-additionals.component.html',
  styleUrls: ['./assignment-additionals.component.scss'],
})
export class AssignmentAdditionalsComponent implements OnInit {
  @Input() additionalPrices: AdditionalPrice[];
  additionalsGroup: FormGroup;


  constructor() {}

  ngOnInit(): void {
    this.initForm();

  }

  initForm() {
    const controls = this.additionalPrices.map(price => new FormControl(price.price));
    this.additionalsGroup = new FormGroup({
      additionals: new FormArray(controls)
    });
  }
}
