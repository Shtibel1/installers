import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Input() control: FormControl;
  @Input() type: string;
  @Input() placeHolder: string;
  @Input() label: string;
  @Input() currency: string;
  @Input() mask: string;
  @Input() disabled: boolean;

  constructor() {}

  ngOnInit(): void {}
}
