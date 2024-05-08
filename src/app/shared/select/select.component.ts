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

  constructor() {}

  ngOnInit(): void {}

  compareIds(id1: any, id2: any): boolean {
    return id1 && id2 && id1.id === id2.id;
  }
}
