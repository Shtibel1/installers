import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Option } from 'src/app/core/models/option.model';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {
  @Input() control: FormControl<Option<any>>;
  @Input() options: Option<any>[];
  @Input() label: string;

  selectedOption: Option<any>;

  constructor() {}

  ngOnInit(): void {
    this.selectedOption =
      this.control.value?.value !== null ? this.control.value : null;

    this.control.valueChanges.subscribe((value) => {
      if (value) {
        this.selectedOption = value;
      } else {
        this.selectedOption = null;
      }
    });
  }

  compareFn(o1: any, o2: any) {
    return o1 && o2 ? JSON.stringify(o1) === JSON.stringify(o2) : o1 === o2;
  }
}
