import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Status, StatusDescriptions } from 'src/app/core/enums/status.enum';
import { Option } from 'src/app/core/models/option.model';

@Component({
  selector: 'app-select-status',
  templateUrl: './select-status.component.html',
  styleUrl: './select-status.component.scss',
})
export class SelectStatusComponent implements OnInit {
  statuseOptions: Option<Status>[];
  innerControl: FormControl<Option<Status>>;
  @Input('control') outerControl: FormControl<Status>;

  ngOnInit(): void {
    this.statuseOptions = Object.keys(Status)
      .filter((key) => isNaN(Number(key))) // filter out numeric keys
      .map((key) => ({
        label: StatusDescriptions[Status[key]],
        value: Status[key],
      }));

    let option: Option<Status> = {
      label: StatusDescriptions[this.outerControl.value],
      value: this.outerControl.value,
    };

    this.innerControl = new FormControl(option);

    this.innerControl.valueChanges.subscribe((value: Option<Status>) => {
      if (value)
      this.outerControl.setValue(value.value);
    });
    this.outerControl.valueChanges.subscribe(status => {
      if (!status)
      this.innerControl?.setValue(null)
    })
  }
}
