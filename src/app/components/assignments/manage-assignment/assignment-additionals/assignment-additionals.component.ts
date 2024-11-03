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
export class AssignmentAdditionalsComponent implements OnInit, OnChanges {
  @Input() additionalPrices: AdditionalPrice[];
  @Input() existingPrices?: AdditionalPrice[] = [];
  additionalsGroup: FormGroup;


  constructor() {}

  ngOnInit(): void {
    this.initForm();
    
  }
  
  ngOnChanges(change: any) {
    console.log(this.additionalPrices)
    this.initForm();
  }

  initForm() {
    let controls = []
    this.additionalPrices.forEach(price =>  {
      let exist = false
      this.existingPrices?.forEach(existingPrice => {
        if (price.id === existingPrice.id) {
          exist = true;
        }
      })
      if (exist) controls.push(new FormControl(true))
      else controls.push(new FormControl(false))
    });
    this.additionalsGroup = new FormGroup({
      additionals: new FormArray(controls)
    });
    console.log(controls)
    console.log(this.additionalPrices)
  }

  getAdditionalPrices() {
    let additionalPrices: AdditionalPrice[] = [];
    (this.additionalsGroup.get('additionals').value).forEach((element, index) => {
        if(element) additionalPrices.push(this.additionalPrices[index])
      });
          return additionalPrices;
  }

}
