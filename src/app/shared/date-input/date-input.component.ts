import { Component, Input, OnInit } from '@angular/core';
import { Form, FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
})
export class DateInputComponent implements OnInit {
  @Input() control: FormControl;

  constructor(private _adapter: DateAdapter<any>) {}

  ngOnInit(): void {
    this._adapter.setLocale('il');
  }
}
