import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PickupStatus, PickupStatusDescriptions } from 'src/app/core/enums/pickup-status.enum';
import { Status, StatusDescriptions } from 'src/app/core/enums/status.enum';
import { Option } from 'src/app/core/models/option.model';

@Component({
  selector: 'app-select-pickup-status',
  templateUrl: './select-pickup-status.component.html',
  styleUrl: './select-pickup-status.component.scss',
})
export class SelectPickupStatusComponent implements OnInit {
  statuseOptions: Option<PickupStatus>[];
  innerControl: FormControl<Option<PickupStatus>>;
  @Input('control') outerControl: FormControl<PickupStatus>;

  ngOnInit(): void {
    this.statuseOptions = Object.keys(PickupStatus)
      .filter((key) => isNaN(Number(key))) // filter out numeric keys
      .map((key) => ({
        label: PickupStatusDescriptions[PickupStatus[key]],
        value: PickupStatus[key],
      }));

    let option: Option<PickupStatus> = {
      label: PickupStatusDescriptions[this.outerControl.value],
      value: this.outerControl.value,
    };

    this.innerControl = new FormControl(option);

    this.innerControl.valueChanges.subscribe((value: Option<PickupStatus>) => {
      this.outerControl.setValue(value.value);
    });
  }
}
