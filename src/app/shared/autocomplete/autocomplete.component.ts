import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, startWith, map, of, debounceTime } from 'rxjs';
import { Option } from 'src/app/core/models/option.model';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit, OnChanges {
  @Input() control: FormControl;
  @Input() options?: Option<any>[];
  @Input() label: string;

  filteredOptions: Option<any>[];

  constructor() {}

  ngOnInit(): void {
    this.filteredOptions = this.options;
    if (this.options) this.setupFilter();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.filteredOptions = this.options;
      if (this.options) this.setupFilter();
    }
  }

  private setupFilter(): void {
    this.control.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        map((value) => this._filter(value || ''))
      )
      .subscribe((filteredOptions) => {
        this.filteredOptions = filteredOptions;
      });
  }

  private _filter(value: string | Option<any>): Option<any>[] {
    value = typeof value === 'string' ? value : value.label;
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.label.toLowerCase().includes(filterValue)
    );
  }

  displayFn(option: Option<any>): string {
    return option && option.label ? option.label : '';
  }
}
